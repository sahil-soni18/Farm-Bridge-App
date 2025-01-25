import express from 'express';
import authenticateToken from '../middlewares/authMiddleware.js';
import { addToCart, getCartItems, updateCart, deleteCart } from '../controllers/cartController.js';

const router = express.Router(); 

router.post('/add-to-cart', authenticateToken, addToCart);
router.get('/get-cart', authenticateToken, getCartItems);
router.put('/update-cart/:cartId', authenticateToken, updateCart);
router.delete('/delete-cart/:cartId', authenticateToken, deleteCart);


export default router;