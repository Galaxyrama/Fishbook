import express from "express";
import * as CommentController from "../controllers/commentController.js"

const router = express.Router();

router.get("/:postId", CommentController.getComments);

router.post("/:type/upload", CommentController.uploadComment);

export default router;