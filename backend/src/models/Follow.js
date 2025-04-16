import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
  userId: {
    //follower
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  followeeId: {
    // person being followed
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

followSchema.index({ userId: 1, followeeId: 1 }, { unique: true });

export const Follow = mongoose.model("Follow", followSchema);
