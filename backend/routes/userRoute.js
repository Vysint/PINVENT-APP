const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logout);

router.get("/loggedin", loginStatus);

router.get("/getuser", protect, getUser);

router.patch("/updateuser", protect, updateUser);

router.patch("/changepassword", protect, changePassword);

router.post("/forgotpassword", forgotPassword);

module.exports = router;
