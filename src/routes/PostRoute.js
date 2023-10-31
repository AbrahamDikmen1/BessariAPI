const express = require("express");
const {
  createPost,
  deletePost,
  getPost,
  getTimelinePosts,
  updatePost,
  getProfile,
} = require("../controllers/PostController.js");
const router = express.Router();

router.post("/", createPost);
router.get("/", getPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.get("/timeline/:id", getTimelinePosts);
router.get("/profile/:name", getProfile);

module.exports = router;
