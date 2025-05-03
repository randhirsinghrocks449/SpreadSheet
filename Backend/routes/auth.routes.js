import express from 'express';
import { checkAuth, loginUser, registerUser } from '../controllers/auth.controller.js';
import { auth } from '../middlewares/auth.middleware.js';


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get("/check", auth, checkAuth);

export default router;