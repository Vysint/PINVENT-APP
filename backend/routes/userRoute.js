const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  getUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logout);

router.get("/getUser", protect, getUser);

module.exports = router;
