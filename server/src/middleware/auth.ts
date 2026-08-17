import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { User } from '../models/User.js';
import { unauthorized } from '../utils/errors.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    name: string;
    email: string;
  };
}

export async function authenticate(req: AuthRequest, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw unauthorized('No token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.userId).select('-password');
    if (!user || !user.active) {
      throw unauthorized('User not found or inactive');
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      name: user.name,
      email: user.email,
    };
    next();
  } catch (err) {
    next(unauthorized('Invalid or expired token'));
  }
}

export function requireAdmin(req: AuthRequest, _res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    next(unauthorized('Admin access required'));
    return;
  }
  next();
}

export async function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.userId).select('-password');
    if (user && user.active) {
      req.user = {
        id: user._id.toString(),
        role: user.role,
        name: user.name,
        email: user.email,
      };
    }
    next();
  } catch {
    next();
  }
}
