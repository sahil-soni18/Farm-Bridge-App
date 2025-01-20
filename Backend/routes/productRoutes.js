import express from 'express'
import { createProduct, getAllProducts } from '../controllers/productController.js';
import authenticateToken from '../middlewares/authMiddleware.js';

const router = express.Router()

router.post('/create', authenticateToken, createProduct)
router.get('/get-all', getAllProducts);

export default router