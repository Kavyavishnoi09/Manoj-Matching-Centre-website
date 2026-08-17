import { Router } from 'express';
import { createOrder, getMyOrders, getOrderById, cancelOrder } from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(authenticate);

router.post('/', asyncHandler(createOrder));
router.get('/my', asyncHandler(getMyOrders));
router.get('/:id', asyncHandler(getOrderById));
router.patch('/:id/cancel', asyncHandler(cancelOrder));

export default router;
