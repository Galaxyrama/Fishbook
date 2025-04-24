import express from "express";
import * as CommentController from "../controllers/commentController.js"

const router = express.Router();

router.get("/:postId/:type", CommentController.getComments);
router.get("/:commentId/isLiked", CommentController.checkIfUserLikedComment);

router.post("/:type/upload", CommentController.uploadComment);
router.post("/:commentId/like", CommentController.likeComment);

router.delete("/status/:commentId/delete", CommentController.deleteComment);

export default router;