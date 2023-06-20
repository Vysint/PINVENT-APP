const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/userRoute");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
dotenv.config();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes Middlewares
app.use("/api/users", userRoutes);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

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
