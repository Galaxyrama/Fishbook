import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postTitle: { type: String, required: false },
    postImage: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
