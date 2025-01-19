import express from 'express';
import { updateUserDetails } from '../controllers/userController.js';
import authenticateToken from '../middlewares/authMiddleware.js';

const router = express.Router();

router.put('/update', authenticateToken, updateUserDetails);

export default router;