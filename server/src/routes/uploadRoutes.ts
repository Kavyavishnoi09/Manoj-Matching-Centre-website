import { Router } from 'express';
import { upload, uploadImage, deleteImage } from '../controllers/uploadController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post('/image', authenticate, requireAdmin, upload.array('images', 10), asyncHandler(uploadImage));
router.delete('/image', authenticate, requireAdmin, asyncHandler(deleteImage));

export default router;
