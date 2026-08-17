import { Router } from 'express';
import {
  register, login, refresh, logout, getMe, updateProfile, changePassword,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.post('/refresh', asyncHandler(refresh));
router.post('/logout', asyncHandler(logout));
router.get('/me', authenticate, asyncHandler(getMe));
router.put('/profile', authenticate, asyncHandler(updateProfile));
router.put('/password', authenticate, asyncHandler(changePassword));

export default router;
