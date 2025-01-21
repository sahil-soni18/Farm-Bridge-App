import express from 'express'
import { createProduct, getAllProducts, getProductById, getProductByCategory, updateProduct, deleteProduct} from '../controllers/productController.js';
import authenticateToken from '../middlewares/authMiddleware.js';

const router = express.Router()

router.post('/create', authenticateToken, createProduct)
router.put('/id/update/:productId', authenticateToken, updateProduct)
router.get('/id/myProducts', authenticateToken, getProductById)
router.get('/get-all', getAllProducts);
router.get('/get-product/category/:category', getProductByCategory);
router.delete('/delete-product/id/:productId', authenticateToken, deleteProduct)

export default router