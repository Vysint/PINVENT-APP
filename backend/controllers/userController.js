const User = require("../models/userModel");
const verifyToken = require("../utils/jwt");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
  res.status(200).json({ message: "Successfully Logged Out" });
};

// @desc   Get user
// route   GET /api/users/logout
// @access private

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        phone: user.phone,
        bio: user.bio,
      });
    } else {
      res.status(401);
      throw new Error("User not found, please login");
    }
  } catch (err) {
    return next(err);
  }
};

// @desc   Get login status
// route   GET /api/users/loggedin
// @access Public

exports.loginStatus = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.json(false);
  }

  // Verify Token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  }
  return res.json(false);
};

// @desc   Update user
// route   PATCH /api/users/updateuser
// @access private

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      const { name, email, photo, phone, bio } = user;
      user.email = email;
      user.name = req.body.name || name;
      user.photo = req.body.photo || photo;
      user.phone = req.body.phone || phone;
      user.bio = req.body.bio || bio;
      const updatedUser = await user.save();

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        photo: updatedUser.photo,
        bio: updatedUser.bio,
      });
    } else {
      res.status(400);
      throw new Error("User Not Found");
    }
  } catch (err) {
    return next(err);
  }
};
