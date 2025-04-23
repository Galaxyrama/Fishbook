import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    commentedOnId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    commentedOnModel: {
      type: String,
      required: true,
      enum: ["Post", "Comment"]
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    commentText: { type: String, default: null },
    commentFile: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);