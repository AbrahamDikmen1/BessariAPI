const PostModel = require("../models/postModel.js");
const UserModel = require("../models/userModel.js");
const mongoose = require("mongoose");

const createPost = async (req, res) => {
  const newPost = new PostModel(req.body);

  try {
    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getPost = async (req, res) => {
  try {
    const post = await PostModel.find({ _id: { $ne: req.params.id } }).select([
      "desc",
      "img",
      "_id",
      "title",
      "createdAt",
    ]);
    res.status(200).json(
      post.sort((a, b) => {
        return (
          new Date(b.createdAt).getFullYear - new Date(a.createdAt).getFullYear
        );
      })
    );
  } catch (error) {
    res.status(500).json(error);
  }
};

const updatePost = async (req, res) => {
  const id = req.params.id;
  const newPost = req.body;

  try {
    const post = await PostModel.findById(id);
    if (post.id === id) {
      await post.updateOne({
        $set: {
          title: newPost.title,
          img: newPost.img,
          desc: newPost.desc,
        },
      });

      res.status(200).json("Post updated");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// delete a post
const deletePost = async (req, res) => {
  const id = req.params.id;
  const { deletePost } = req.body;

  try {
    const post = await PostModel.findById(id);
    if (post.deletePost === deletePost) {
      await post.deleteOne();
      res.status(200).json("Post deleted.");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get timeline posts
const getTimelinePosts = async (req, res) => {
  const userId = req.params.id;
  try {
    const currentUserPosts = await PostModel.find({ userId: userId });

    res.status(200).json(
      currentUserPosts.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
    );
  } catch (error) {
    res.status(500).json(error);
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findOne({ name: req.params.name });
    const posts = await PostModel.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  createPost,
  deletePost,
  getPost,
  getTimelinePosts,
  updatePost,
  getProfile,
};
