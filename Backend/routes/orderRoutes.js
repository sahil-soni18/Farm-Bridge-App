import express from 'express';
import { createOrder, getOrderById, getAllOrders, updateOrderStatus, deleteOrder} from '../controllers/orderController.js';
import authenticateToken from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-order', authenticateToken, createOrder);
router.get('/user/orders', authenticateToken, getOrderById);
router.get('/admin/all-orders', getAllOrders)
router.put('/admin/update-order/:orderId', updateOrderStatus)
router.delete('/user/order/cancel/:orderId', authenticateToken, deleteOrder)
router.patch('/:orderId', updateOrderStatus);
router.get('/:orderId/status', getOrderStatus);
router.post('/:orderId/return', initiateReturn);

export default router;