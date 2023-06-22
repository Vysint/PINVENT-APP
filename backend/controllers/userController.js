const User = require("../models/userModel");
const verifyToken = require("../utils/jwt");
const bcrypt = require("bcryptjs");

// @desc   Register a new user
// route   POST /api/users
// @access Public
exports.registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  // Validation
  try {
    if (!name || !email || !password) {
      res.status(401);
      throw new Error("Please fill all required fields");
    }
  } catch (err) {
    return next(err);
  }

  // Password Check

  try {
    if (password.length < 6) {
      res.status(400);
      throw new Error("Password must be upto 6 characters");
    }
  } catch (err) {
    return next(err);
  }

  // Check if user exists
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(401);
      throw new Error("Email has already been registered");
    }
  } catch (err) {
    return next(err);
  }

  // Create a new User

  try {
    const newUser = new User({
      name,
      email,
      password,
    });
    const savedUser = await newUser.save();
    verifyToken(res, savedUser._id);
    res.status(201).json({
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      photo: savedUser.photo,
      phone: savedUser.phone,
      bio: savedUser.bio,
    });
  } catch (err) {
    return next(err);
  }
};

// @desc   Login user /set token
// route   POST /api/users/login
// @access Public

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate Request
  try {
    if (!email || !password) {
      res.status(400);
      throw new Error("Please add email and password");
    }
  } catch (err) {
    return next(err);
  }

  // Check if user exists
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("User not found, please register instead.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401);
      throw new Error("Wrong Password");
    }

    verifyToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    return next(err);
  }
};

// @desc   Logout user
// route   POST /api/users/logout
// @access Public

exports.logout = async (req, res, next) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Successfullt Logged Out" });
};
