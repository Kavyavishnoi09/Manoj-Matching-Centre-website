import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export { asyncHandler };

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong on the server',
  });
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
}
