export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function notFound(message: string): AppError {
  return new AppError(message, 404);
}

export function badRequest(message: string): AppError {
  return new AppError(message, 400);
}

export function unauthorized(message = 'Unauthorized'): AppError {
  return new AppError(message, 401);
}

export function forbidden(message = 'Forbidden'): AppError {
  return new AppError(message, 403);
}
