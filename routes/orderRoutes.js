import express from 'express';
import { getOrders, getOrderById, updateOrderStatus, createOrder } from '../controllers/orderController.js';

const router = express.Router();

router.get('/', getOrders);
router.post('/', createOrder);
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);

export default router;
