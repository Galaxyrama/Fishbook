import express from "express";
import * as PostController from "../controllers/postController.js";

const router = express.Router();

router.post('/upload', PostController.uploadPost);
router.get('/', PostController.getPosts);
router.get('/:username', PostController.getUserPosts);
router.put('/edit');
router.put('/:postId');

export default router;
