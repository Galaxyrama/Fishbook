import { Post } from "../models/Post.js";
import { User } from "../models/User.js";
import { uploadPostFile } from "../services/cloudinary.js";

export const uploadPost = async (req, res, next) => {
  const { postTitle, postImage } = req.body;
  const userId = req.session.userID;

  try {
    let uploadImage = {};

    if (postImage) {
      const result = await uploadPostFile(postImage, "Fishbook");
      uploadImage = result;
    }

    const newPost = await Post.create({
      userId: userId,
      postTitle: postTitle ? postTitle : null,
      postImage: uploadImage ? uploadImage : null,
    });

    return res.status(201).json(newPost);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Couldn't create post" });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("userId", "username profilePic.url")
      .sort({ createdAt: -1 });

    return res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Couldn't get posts" });
  }
};

export const getUserPosts = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).exec();

    if (!user) {
      return res.status(400).json({ error: "Couldn't find the user" });
    }

    const posts = await Post.find({ userId: user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Couldn't get the user's posts" });
  }
};

export const likePost = async (req, res) => {
  
};

export const unlikePost = async (req, res) => {};
