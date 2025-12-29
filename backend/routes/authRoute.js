const express = require("express");
const router = express.Router();

//user controllers
const {register,login,checkUser}=require("../controllers/authController");

//register route
router.post("/register",register) 


module.exports = router;


