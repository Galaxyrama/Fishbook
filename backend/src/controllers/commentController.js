import { Comment } from "../models/Comment.js";
import { Like } from "../models/Like.js";
import { User } from "../models/User.js";
import { Post } from "../models/Post.js";

export const getComments = async (req, res) => {
  const { postId } = req.body;

  try {
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Couldn't get comments" });
  }
};
