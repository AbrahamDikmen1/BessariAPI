const mongoose = require("mongoose");

// Create user Schema & model
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      maxlength: 50,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    repeat_password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    avatarImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model("User", userSchema);
module.exports = model;
