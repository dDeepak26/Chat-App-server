const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controller/UserController");
const {
  registerUserValidator,
  loginUserValidator,
} = require("../validator/UserValidator");

// register route
router.post("/register", registerUserValidator, registerUser);

// login route
router.post("/login", loginUserValidator, loginUser);

module.exports = router;
