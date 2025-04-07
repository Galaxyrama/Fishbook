import { timeStamp } from "console";
import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    userId: { type: String, require: true },
    postTitle: { type: String, require: true },
}, { timestamps: true })