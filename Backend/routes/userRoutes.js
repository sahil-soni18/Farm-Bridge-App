import express from 'express';
import { updateUserDetails, getProfile } from '../controllers/userController.js';
import authenticateToken from '../middlewares/authMiddleware.js';

const router = express.Router();

router.put('/update', authenticateToken, updateUserDetails);
router.get('/get/profile', authenticateToken, getProfile);

export default router;