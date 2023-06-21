const User = require("../models/userModel");
const verifyToken = require("../utils/jwt");

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
