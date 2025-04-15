import express from "express";
import * as PostController from "../controllers/postController.js";

const router = express.Router();

router.post('/upload', PostController.uploadPost);
router.get('/', PostController.getPosts);
router.get('/:username', PostController.getUserPosts);
router.get('/status/:postId', PostController.getPost);
router.put('/edit');

export default router;
