const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (user, next) => {
  try {
    payload = { username: user._id };
    jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.TOKEN_EXP,
    });
  } catch (error) {
    next(error);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const saltround = 10;
    const hashPassword = await bcrypt.hash(req.body.password, saltround);
    req.body.password = hashPassword;
    const newUser = await User.create(req.body);
    const token = generateToken(newUser);
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

exports.signin = async (req, res) => {
  try {
    const token = await generateToken(req.user);
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json("Server Error");
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate("urls");
    res.status(201).json(users);
  } catch (err) {
    next(err);
  }
};
