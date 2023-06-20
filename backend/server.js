const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
dotenv.config();

// Connect to mongoDB
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connect to mongoDB!`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
};

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server listening at ${process.env.PORT}`);
  connect();
});
