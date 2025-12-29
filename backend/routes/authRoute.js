const express = require("express");
const router = express.Router();
const { register, login, checkUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

//register route
router.post("/register", register);
router.post("/login", login);
router.get("/check", authMiddleware, checkUser);

module.exports = router;
