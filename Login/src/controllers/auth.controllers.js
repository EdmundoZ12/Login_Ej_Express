const { json } = require("express");
const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createAccessToken } = require("../libs/jwt");

const register = async (req, res) => {
  //insertar datos
  const { ussername, password } = req.body;
  try {
    // Verificar si ya existe una tarea con el mismo título
    const existingUser = await pool.query(
      "SELECT * FROM Usuario WHERE ussername = $1",
      [ussername]
    );
    if (existingUser.rowCount === 0) {
      // Si no existe, insertar la tarea
      const passwordhash = await bcrypt.hash(password, 10);
      const result = await pool.query(
        "INSERT INTO Usuario (ussername, password) VALUES ($1, $2) RETURNING id,ussername",
        [ussername, passwordhash]
      );
      const newUser = result.rows[0];
      const token = await createAccessToken({ id: newUser.id });

      res.cookie("token", token);
      res.json(newUser);
    } else {
      // La tarea ya existe, puedes devolver un mensaje personalizado si lo deseas
      res.status(400).json({ error: "El nombre de Usuario ya existe." });
    }
  } catch (error) {
    // Otros errores
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  //obtener datos de una tarea especifica
  const { ussername, password } = req.body;
  try {
    const usuario = await pool.query(
      "SELECT * FROM Usuario WHERE ussername=$1",
      [ussername]
    );

    if (usuario.rows.length === 0) {
      return res.status(400).json({ mensaje: "Usuario no encontrado." });
    }
    const Infuser = usuario.rows[0];
    const isMatch = await bcrypt.compare(password, Infuser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    const token = await createAccessToken({ id: Infuser.id });

    res.cookie("token", token);
    res.json({id:Infuser.id,ussername:Infuser.ussername});
    // La tarea ya existe, puedes devolver un mensaje personalizado si lo deseas
  } catch (error) {
    // Otros errores
    res.status(500).json({ message: error.message });
  }
};


const logout=(req,res)=>{
  res.cookie("token","",{
    expires:new Date(0)
  })
 return res.sendStatus(200)
}

const profile=async(req,res)=>{
  const userFound=await pool.query(
    "SELECT * FROM Usuario WHERE id=$1",
    [req.user.id]
  );

  if (userFound.rows.length === 0) {
    return res.status(400).json({ mensaje: "Usuario no encontrado." });
  }
  
  return res.json({
    id:userFound.rows[0].id,
    ussername:userFound.rows[0].ussername
  })
}

module.exports = {
  login,
  register,
  logout,
  profile
};
