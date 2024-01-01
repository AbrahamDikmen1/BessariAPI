const express = require("express");
const {
  login,
  logout,
  registerUser,
} = require("../controllers/AuthControllers");

require("dotenv").config();

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
