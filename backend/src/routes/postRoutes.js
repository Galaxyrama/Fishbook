import express from "express";
import * as PostController from "../controllers/postController.js";

const router = express.Router();

router.post('/upload', PostController.uploadPost);
router.get('/', PostController.getPosts);
router.put('/edit')

export default router;
