const { Router } = require("express");
const {
  login, register, logout
} = require("../controllers/auth.controllers");
const pool = require("../db");
const router = Router();



router.post("/login", login);
router.post("/register",register);
router.post("/logout",logout);

module.exports = router;