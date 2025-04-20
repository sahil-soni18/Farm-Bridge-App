import express from 'express';
import authenticateToken from '../middlewares/authMiddleware.js';
import { GetPaymentById, GetPaymentByUserId, MakePayment } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/pay', authenticateToken, MakePayment);
router.get('/get-history', authenticateToken, GetPaymentByUserId);
router.get('/:transaction_id', GetPaymentById)

export default router;