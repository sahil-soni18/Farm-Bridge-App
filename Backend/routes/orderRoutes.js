import express from 'express';
import { createOrder } from '../controllers/orderController.js';
import authenticateToken from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-order', authenticateToken, createOrder);

export default router;