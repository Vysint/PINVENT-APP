const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minLength: [6, "Password must be upto 6 characters"],
      maxLength: [
        23,
        "Password must have a minimum of 6 characters and a maximum of 23 characters",
      ],
    },
    photo: {
      type: String,
      required: [true, "Please add a Photo"],
      default: "https://i.ibb.co/3k2BG3T/profile.png",
    },
    phone: {
      type: String,
      default: "+254",
    },
    bio: {
      type: String,
      maxLength: [250, "Bio must not be more than 250 Characters"],
      default: "bio",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
