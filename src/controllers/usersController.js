const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "name",

      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
});

// Update a users in the db
const updateUsers = asyncHandler(async (req, res) => {
  try {
    let doc = await User.findByIdAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
    });
    res.json(doc);
  } catch (error) {
    res.send({ error });
  }
});
module.exports = { getUsers, updateUsers };
