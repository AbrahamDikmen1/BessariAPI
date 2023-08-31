const express = require("express");
const {
  login,
  logout,
  registerUser,
} = require("../controllers/AuthControllers");
const { getUsers, updateUsers } = require("../controllers/usersController");
require("dotenv").config();

const router = express.Router();

router.route("/register").post(registerUser);
router.post("/login", login);
router.post("/logout", logout);

router.get("/allusers/:id", getUsers);
router.put("/allusers/:id", updateUsers);

module.exports = router;
