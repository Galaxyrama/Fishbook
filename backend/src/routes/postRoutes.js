import express from "express";
import * as PostController from "../controllers/postController.js";

const router = express.Router();

router.post('/upload', PostController.uploadPost);
router.post('/status/:postId/like', PostController.likePost);

router.get('/', PostController.getPosts);
router.get('/:username', PostController.getUserPosts);
router.get('/status/:postId', PostController.getPost);
router.get('/:postId/isLiked', PostController.checkIfUserLikedPost);

router.put('/edit');

export default router;
