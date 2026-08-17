import { Router } from 'express';
import {
  getProducts, getProductById, createProduct, updateProduct, deleteProduct,
  getFeaturedProducts, getNewArrivals, getPopularProducts,
} from '../controllers/productController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(getProducts));
router.get('/featured', asyncHandler(getFeaturedProducts));
router.get('/new-arrivals', asyncHandler(getNewArrivals));
router.get('/popular', asyncHandler(getPopularProducts));
router.get('/:id', asyncHandler(getProductById));
router.post('/', authenticate, requireAdmin, asyncHandler(createProduct));
router.put('/:id', authenticate, requireAdmin, asyncHandler(updateProduct));
router.delete('/:id', authenticate, requireAdmin, asyncHandler(deleteProduct));

export default router;
