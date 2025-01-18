import express from 'express';
import { Signup, Login, Logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', Signup);
router.post('/login', Login);
router.get('/logout', Logout);

export default router;