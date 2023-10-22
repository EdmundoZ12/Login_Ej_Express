const pool = require("../db");

const getTasks = async (req, res, next) => {
  try {
    const allTasks = await pool.query("SELECT * FROM task");
    res.json(allTasks.rows);
  } catch (error) {
    next(error);
  }
};

const getTask = async (req, res, next) => {
  try {
    const id = req.params.id;
    const Task = await pool.query("SELECT * FROM task WHERE id=$1", [id]);

    if (Task.rows.length === 0) {
      return res.status(404).json({ mensaje: "La tarea no fue encontrada." });
    }

    res.json(Task.rows[0]);
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  const { title, description,fecha } = req.body;
  try {
    const Id_User=req.user.id;
    if (fecha) {
        // Si se proporciona la fecha, asumimos que ya está en el formato deseado "DD/MM/YYYY"
        formattedDate = fecha;
      } else {
        // Si no se proporciona la fecha, obtener la fecha actual en formato "DD/MM/YYYY"
        const currentDate = new Date();
        const day = currentDate.getDate().toString().padStart(2, '0');
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear();
        formattedDate = `${day}/${month}/${year}`;
      } 
    const existingTask = await pool.query(
      "SELECT * FROM task WHERE title = $1",
      [title]
    );
    if (existingTask.rowCount === 0) {
      const result = await pool.query(
        "INSERT INTO task (Id_User,title, description,fecha) VALUES ($1, $2,$3,$4) RETURNING *",
        [Id_User,title, description,formattedDate]
      );
      res.json(result.rows[0]);
    } else {
      res
        .status(400)
        .json({ error: "La tarea con el mismo título ya existe." });
    }
  } catch (error) {
    // res.status(500).json({ error: "Error interno del servidor." });
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params.id;
    
    const deleteT = await pool.query("DELETE FROM task WHERE id=$1", [
      //DELETE FROM task WHERE id=$1 RETURNING *
      id,
    ]);
    if (deleteT.rowCount === 0) {
      return res.status(404).json({ mensaje: "La tarea no fue encontrada." });
    }

    return res.sendStatus(204);
  } catch (error) {
    //res.status(500).json({ error: "Error interno del servidor." });
    next(error);
  }
};

const updateTask = (req, res, next) => {
  try {
    const id=req.params.id;
    const { title, description ,fecha} = req.body;

    const result = pool.query(
      "UPDATE task SET title=$1 , description=$2 , fecha=$3 WHERE id=$4 RETURNING*",
      [title, description, fecha,id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "La tarea no fue encontrada." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
