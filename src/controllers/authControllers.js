const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const genAuthToken = require("../utils/genAuthToken");
const dayjs = require("dayjs");

// Add a new users to the db
const registerUser = asyncHandler(async (req, res) => {
  // Schema for register user
  const pattern =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  const schema = Joi.object({
    name: Joi.string().min(8).max(20).required().label("Name field"),

    email: Joi.string()

      .max(40)
      .required("Password is required")
      .email()
      .label("Email is required"),

    password: Joi.string().min(8).regex(RegExp(pattern)).required().messages({
      "string.pattern.base": "",
      "string.min": "",
    }),

    repeat_password: Joi.any()
      .equal(Joi.ref("password"))
      .required("Password is required")
      .label("Password")
      .options({ messages: { "any.only": "{{#label}} does not match" } }),
  });
  // Check if schema values are good to go
  const { error } = schema.validate(req.body);
  console.log(schema);
  if (error) return res.status(400).send(error.details[0].message);

  // Check through usernames and emails if the names already exists

  let user = await User.findOne({ name: req.body.name });
  let email = await User.findOne({ email: req.body.email });

  if (user)
    return res.status(400).send("Username already exist..try another one");

  if (email)
    return res.status(400).send("Email already exist..try another one");

  // Create new user model
  user = new User({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    repeat_password: req.body.repeat_password,
  });

  const salt = await bcrypt.genSalt(10);

  // Hash password ( Protection against hackers for the database )
  user.password = await bcrypt.hash(user.password, salt);
  user.repeat_password = await bcrypt.hash(user.repeat_password, salt);

  user = await user.save();

  // Generate token for the registred user

  res.send(user);
});

const login = asyncHandler(async (req, res) => {
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

const logout = asyncHandler(async (req, res) => {
  // Set token to none and expire after 5 seconds
  res.cookie("access_token", "none", {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });
  res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
});

module.exports = { login, logout, registerUser };
