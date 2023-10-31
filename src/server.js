const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const AuthRoute = require("./routes/AuthRoute");
const PostRoute = require("./routes/PostRoute");
const UploadRoute = require("./routes/UploadRoute");
const UserRoute = require("./routes/UsersRoute");
const app = express();

require("dotenv").config();
app.use(express.static("public"));
// Initialize routess
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/upload", UploadRoute);
app.use("/api/auth", AuthRoute);
app.use("/api/posts", PostRoute);
app.use("/api/users", UserRoute);

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
const port = process.env.PORT;
app.listen(port, () => console.log(`Listning to port ${port}`));
