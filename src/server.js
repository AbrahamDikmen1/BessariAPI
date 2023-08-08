const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

require("dotenv").config();

// Initialize routess
app.use(bodyParser.json());
app.use(cors());

// error handling middleware
app.use((err, req, res, next) => {
  res.status(422).send({ error: err.message });
});

// DB Connection
const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check DB Connection
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// Listen to port
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listning to port ${port}`));
