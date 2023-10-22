const { Router } = require("express");
const {
  login, register, logout, profile
} = require("../controllers/auth.controllers");
const pool = require("../db");
const {authRequired} = require('../middlewares/validateToken');
const router = Router();



router.post("/login", login);
router.post("/register",register);
router.post("/logout",logout);
router.get("/profile",authRequired,profile)

module.exports = router;