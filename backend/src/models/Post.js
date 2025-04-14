import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: { type: String, require: true },
    postTitle: { type: String, require: false },
    postImage: { type: String, require: false },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
