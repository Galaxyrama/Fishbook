import { Comment } from "../models/Comment.js";
import { Like } from "../models/Like.js";
import { User } from "../models/User.js";
import { Post } from "../models/Post.js";
import { uploadFile, deleteFile } from "../services/cloudinary.js";

export const getComments = async (req, res) => {
  const { postId } = req.body;

  try {
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Couldn't get comments" });
  }
};

export const uploadComment = async (req, res) => {
  const { commentTitle, commentFile, commentedOnId } = req.body;
  const { type } = req.params;
  const userId = req.session.userID;

  try {
    let uploadCommentFile = {};

    if (commentFile) {
      const result = await uploadFile(commentFile, "CommentFile", "auto");
      uploadCommentFile = result;
    }

    const newComment = await Comment.create({
      commentedOnId,
      commentedOnModel: type,
      userId,
      commentText: commentTitle,
      commentFile: uploadCommentFile,
    });

    if (type === "Post") {
      await Post.findByIdAndUpdate(commentedOnId, {
        $inc: { commentCount: 1 },
      });
    } else {
      await Comment.findByIdAndUpdate(commentedOnId, {
        $inc: { commentCount: 1 },
      });
    }

    return res.status(201).json(newComment);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Couldn't upload commment" });
  }
};