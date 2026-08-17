import { Router } from 'express';
import {
  getStats, getAllOrders, getAdminOrderById, updateOrderStatus,
  getCustomers, getCustomerById, toggleCustomerActive, getAdminProducts,
} from '../controllers/adminController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/stats', asyncHandler(getStats));
router.get('/orders', asyncHandler(getAllOrders));
router.get('/orders/:id', asyncHandler(getAdminOrderById));
router.patch('/orders/:id/status', asyncHandler(updateOrderStatus));
router.get('/customers', asyncHandler(getCustomers));
router.get('/customers/:id', asyncHandler(getCustomerById));
router.patch('/customers/:id/toggle-active', asyncHandler(toggleCustomerActive));
router.get('/products', asyncHandler(getAdminProducts));

export default router;
