import { Router } from 'express';
import {
  getCategories, getCategoryById, createCategory, updateCategory, deleteCategory,
} from '../controllers/categoryController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(getCategories));
router.get('/:id', asyncHandler(getCategoryById));
router.post('/', authenticate, requireAdmin, asyncHandler(createCategory));
router.put('/:id', authenticate, requireAdmin, asyncHandler(updateCategory));
router.delete('/:id', authenticate, requireAdmin, asyncHandler(deleteCategory));

export default router;
