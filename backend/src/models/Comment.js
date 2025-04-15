import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    commentText: { type: String, require: true },
    likeAmount: { type: Number, default: 0 },
    commentAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
