const express = require("express");

const { getUsers, updateUsers } = require("../controllers/usersController");
require("dotenv").config();

const router = express.Router();

router.get("/allusers/:id", getUsers);
router.put("/allusers/:id", updateUsers);

module.exports = router;
