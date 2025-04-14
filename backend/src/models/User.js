import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, select: false },
    password: { type: String, required: true, select: false },
    gender: { type: String, default: null },
    currentLocation: { type: String, default: null },
    description: { type: String, default: null },
    birthDate: { type: Date, default: null },
    profilePic: {
      url: { type: String, default: null },
      publicId: { type: String, default: null }
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);