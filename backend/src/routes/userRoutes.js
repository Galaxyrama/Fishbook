import express from "express";
import * as UserController from "../controllers/userControllers.js"

const router = express.Router();

router.put('/forgot-password', UserController.forgotPassword);
router.get('/session', UserController.authenticateUser);
router.get('/', UserController.getUserDetails);
router.get("/logout", UserController.logOut);
router.post('/login', UserController.logIn);
router.post('/register', UserController.signUp);
router.put('/setup', UserController.editUser);

export default router;