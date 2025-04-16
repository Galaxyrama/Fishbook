import express from "express";
import * as UserController from "../controllers/userControllers.js"

const router = express.Router();

router.get('/session', UserController.authenticateUser);
router.get('/', UserController.getCurrentUserDetails);
router.get("/logout", UserController.logOut);
router.get('/:username', UserController.getUserDetails);
router.get('/:username/follow', UserController.checkIfFollowed);

router.post('/login', UserController.logIn);
router.post('/register', UserController.signUp);
router.post('/:username/follow', UserController.followUser)

router.put('/setup', UserController.editUser);
router.put('/forgot-password', UserController.forgotPassword);

export default router;