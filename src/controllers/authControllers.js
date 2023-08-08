const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const genAuthToken = require("../utils/genAuthToken");
const dayjs = require("dayjs");

// Add a new users to the db


const logIn = asyncHandler(async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(25).required(),
    password: Joi.string().min(5).max(200).required(),
  });

  // Validate object
  const { error } = schema.validate(req.body);

  // Failed object
  if (error) return res.status(400).send(error.details[0].message);

  // Check if user already exists
  let user = await User.findOne({ name: req.body.name });
  if (!user) return res.status(400).send("Invalid username or password");

  // Vlidate password
  const isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid) return res.status(400).send("Invalid username or password");

  // Generate token

  const token = genAuthToken(user);
  res.cookie("access_token", token, {
    secure: false,
    httpOnly: true,
    expires: dayjs().add(7, "days").toDate(),
  });
  res.send(token);
});

const logOut = asyncHandler(async (req, res) => {
  // Set token to none and expire after 5 seconds
  res.cookie("access_token", "none", {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });
  res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
});

module.exports = { logIn, logOut };
