import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
  bulkUpdateStock
} from '../controllers/productController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

// All routes require authentication
router.use(userAuth);

// Get product statistics
router.get('/stats', getProductStats);

// Get all products with filtering and pagination
router.get('/', getProducts);

// Get single product
router.get('/:id', getProductById);

// Create new product
router.post('/', createProduct);

// Update product
router.put('/:id', updateProduct);

// Delete product (soft delete)
router.delete('/:id', deleteProduct);

// Bulk update stock
router.put('/bulk/stock', bulkUpdateStock);

export default router;
