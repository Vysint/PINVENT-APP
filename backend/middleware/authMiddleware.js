const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

exports.protect = async (req, res, next) => {
  let token = req.cookies.jwt;

  try {
    if (token) {
      try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Get user from token
        req.user = await User.findById(decoded.id).select("-password");
        next();
      } catch (err) {
        return next(err);
      }
    } else {
      res.status(400);
      throw new Error("Not authorized, please login");
    }
  } catch (err) {
    return next(err);
  }
};
