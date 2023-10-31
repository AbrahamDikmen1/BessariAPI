const express = require("express");
const router = express.Router();
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");

const app = express();

app.use(morgan("common"));
app.use(helmet());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
router.post("/", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
