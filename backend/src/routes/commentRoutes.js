import express from "express";
import * as CommentController from "../controllers/commentController.js"

const router = express.Router();

router.get("/:postId", CommentController.getComments);

export default router;