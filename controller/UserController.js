const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/UserModel");

// JWT SECRET KEY
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// register the user
const registerUser = async (req, res) => {
  try {
    // checking if body present
    if (
      !req.body ||
      !req.body.fullName ||
      !req.body.email ||
      !req.body.password
    ) {
      return res.status(400).json({
        errMsg: "missing fields fullname, email, password is required",
      });
    }

    // validating fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errMsg: errors
          .array()
          .map((err) => ({ field: err.param, message: err.msg })),
      });
    }

    // checking if user is already registered or not
    const userDb = await UserModel.findOne({ email: req.body.email });
    if (userDb) {
      return res.status(409).json({ errMsg: "user is already registered" });
    }

    // hashing the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // creating new document of user with hashed password
    const newUser = new UserModel({
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashedPassword,
    });
    // saving the user in db
    const user = await newUser.save();

    res.status(201).json({ msg: "user register successfully", data: user });
  } catch (err) {
    console.error("Error in registering the user", err);
    res.status(500).json({ errMsg: "Error in register" });
  }
};

const loginUser = async (req, res) => {
  try {
    // checking if body is present
    if (!req.body || !req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ errMsg: "missing fields email and password is required" });
    }

    // validating the body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errMsg: errors
          .array()
          .map((err) => ({ field: err.param, message: err.msg })),
      });
    }

    // checking if user is registered
    const userDb = await UserModel.findOne({ email: req.body.email });
    if (!userDb) {
      return res.status(404).json({ errMsg: "register first" });
    }

    // verifying the password
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      userDb.password
    );
    if (!passwordMatch) {
      return res.status(400).json({ errMsg: "incorrect password" });
    }

    // generating token
    const token = await jwt.sign(
      {
        _id: userDb._id,
        fullName: userDb.fullName,
        email: userDb.email,
      },
      JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    // sending final response
    res
      .status(200)
      .json({ msg: "loggedIn successfully", token: token, user: userDb });
  } catch (err) {
    console.error("Error in logging the user ", err);
    res.status(500).json({ errMsg: "Error in logging the user" });
  }
};

module.exports = { registerUser, loginUser };
