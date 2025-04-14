import { Post } from "../models/Post.js";
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
        postTitle: (postTitle? postTitle : null),
        postImage: (uploadImage? uploadImage : null)
    });

    res.status(201).json(newPost);
  } catch (e) {
    next(e);
    res.status(500).json({ error: "Couldn't create post" });
  }
};

export const getPosts = async (req, res) => {};
