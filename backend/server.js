const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/userRoute");

const app = express();
dotenv.config();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes Middleware
app.use("/api/users", userRoutes);
app.get("/", (req, res, next) => {
  res.send("Home Page");
});

// Connect to mongoDB
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to mongoDB!`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
};

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server listening at ${process.env.PORT}`);
  connect();
});
