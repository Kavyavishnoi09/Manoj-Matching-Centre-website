import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config/index.js';

export interface AccessTokenPayload {
  userId: string;
  role: string;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign({ ...payload, jti: crypto.randomUUID() }, config.jwtSecret, { expiresIn: config.jwtExpiresIn } as jwt.SignOptions);
}

export function signRefreshToken(payload: AccessTokenPayload): string {
  return jwt.sign({ ...payload, jti: crypto.randomUUID() }, config.jwtRefreshSecret, { expiresIn: config.jwtRefreshExpiresIn } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, config.jwtSecret) as AccessTokenPayload;
  return { userId: decoded.userId, role: decoded.role };
}

export function verifyRefreshToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, config.jwtRefreshSecret) as AccessTokenPayload;
  return { userId: decoded.userId, role: decoded.role };
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateOrderNumber(count: number): string {
  const year = new Date().getFullYear();
  const padded = String(count).padStart(6, '0');
  return `MMC-${year}-${padded}`;
}
