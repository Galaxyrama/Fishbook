import { Comment } from "../models/Comment.js";
import { Like } from "../models/Like.js";
import { Post } from "../models/Post.js";
import { uploadFile, deleteFile } from "../services/cloudinary.js";

export const getComments = async (req, res) => {
  const { postId, type } = req.params;
  const userId = req.session.userID;

  try {
    const comments = await Comment.find({
      commentedOnId: postId,
      commentedOnModel: type,
    })
      .populate("userId", "username profilePic.url")
      .sort({ createdAt: -1 });

    const commentsWithSameUser = comments.map((comment) => {
      const isSameUser = comment.userId._id.toString() === userId;
      return { ...comment.toObject(), same: isSameUser };
    });

    return res.status(200).json(commentsWithSameUser);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Couldn't get comments" });
  }
};

export const getCommentAndPost = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.session.userID;

  try {
    const comment = await Comment.findById(commentId)
      .populate("userId", "username profilePic.url")
      .exec();

    const post = await Post.findById(comment.commentedOnId)
      .populate("userId", "username profilePic.url")
      .exec();

    const commentedOn = await Comment.findById(comment.commentedOnId)
      .populate("userId", "username profilePic.url")
      .exec();

    let sameUser = comment.userId._id.toString() === userId;

    const updateFields = {
      comment,
      sameUser,
    };

    if (post) {
      updateFields.post = post;
      updateFields.type = "status";
    }

    if (commentedOn) {
      updateFields.post = commentedOn;
      updateFields.type = "comment";
    }

    return res.status(200).json(updateFields);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Couldn't get the comment" });
  }
};

export const uploadComment = async (req, res) => {
  const { postTitle, postImage, commentedOnId } = req.body;
  const { type } = req.params;
  const userId = req.session.userID;

  try {
    let uploadCommentFile = {};

    if (postImage) {
      const result = await uploadFile(postImage, "CommentFile", "auto");
      uploadCommentFile = result;
    }

    const newComment = await Comment.create({
      commentedOnId,
      commentedOnModel: type,
      userId,
      postTitle,
      postImage: uploadCommentFile,
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

export const editComment = async (req, res) => {
  const { commentId } = req.params;
  const { postTitle, postImage } = req.body;

  try {
    let uploadedFile = {};

    const comment = await Comment.findById(commentId).exec();

    const updateFields = {
      postTitle,
    };

    if (postImage) {
      const result = await uploadFile(postImage, "CommentFile", "auto");
      uploadedFile = result;
      updateFields.postImage = uploadedFile;

      if (comment?.postImage?.publicId) {
        await deleteFile(comment?.postImage?.publicId, "CommentFile");
      }
    }

    if (!postImage && comment?.postImage?.publicId) {
      await deleteFile(comment?.postImage?.publicId, "CommentFile");
      updateFields.postImage = { url: null, publicId: null };
    }

    const updatedPost = await Comment.findByIdAndUpdate(
      { _id: commentId },
      updateFields,
      { new: true }
    );

    return res.status(200).json(updatedPost);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Couldn't edit the comment" });
  }
};

export const checkIfUserLikedComment = async (req, res) => {
  const userId = req.session.userID;
  const { commentId } = req.params;

  try {
    const liked = await Like.findOne({
      userId,
      refType: "Comment",
      refId: commentId,
    });

    return res.status(200).json({ liked: !!liked });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ error: "Couldn't find the like relationship." });
  }
};

export const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId).exec();

    await Comment.findByIdAndDelete(commentId);

    if (comment?.postImage?.publicId) {
      await deleteFile(comment?.postImage?.publicId, "Comment");
    }

    if (comment.commentedOnModel === "Post") {
      await Post.findByIdAndUpdate(comment.commentedOnId, {
        $inc: { commentCount: -1 },
      });
    } else {
      await Comment.findByIdAndUpdate(comment.commentedOnId, {
        $inc: { commentCount: -1 },
      });
    }

    return res
      .status(200)
      .json({ message: "Successfully deleted the comment" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Couldn't delete the post" });
  }
};

export const likeComment = async (req, res) => {
  const userId = req.session.userID;
  const { commentId } = req.params;

  try {
    const existing = await Like.findOne({
      userId,
      refType: "Comment",
      refId: commentId,
    });

    if (!existing) {
      await Like.create({ userId, refType: "Comment", refId: commentId });
      await Comment.findByIdAndUpdate(commentId, { $inc: { likeCount: 1 } });
      return res.status(200).json({ liked: true });
    } else {
      await Like.findByIdAndDelete(existing._id);
      await Comment.findByIdAndUpdate(commentId, { $inc: { likeCount: -1 } });
      return res.status(200).json({ liked: false });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Couldn't like the comment" });
  }
};