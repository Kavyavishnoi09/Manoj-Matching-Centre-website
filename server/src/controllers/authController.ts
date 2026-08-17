import type { Response } from 'express';
import { User } from '../models/User.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken, hashToken } from '../utils/jwt.js';
import { badRequest, unauthorized, notFound } from '../utils/errors.js';
import type { AuthRequest } from '../middleware/auth.js';

export async function register(req: AuthRequest, res: Response) {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    throw badRequest('Name, email, and password are required');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw badRequest('An account with this email already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    phone: phone || '',
    role: 'customer',
  });

  const accessToken = signAccessToken({ userId: user._id.toString(), role: user.role });
  const refreshToken = signRefreshToken({ userId: user._id.toString(), role: user.role });

  await RefreshToken.create({
    user: user._id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.status(201).json({
    success: true,
    data: {
      user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone },
      accessToken,
      refreshToken,
    },
  });
}

export async function login(req: AuthRequest, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw badRequest('Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw unauthorized('Invalid email or password');
  }

  if (!user.active) {
    throw unauthorized('Your account has been disabled. Please contact support.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw unauthorized('Invalid email or password');
  }

  const accessToken = signAccessToken({ userId: user._id.toString(), role: user.role });
  const refreshToken = signRefreshToken({ userId: user._id.toString(), role: user.role });

  await RefreshToken.create({
    user: user._id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.json({
    success: true,
    data: {
      user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone },
      accessToken,
      refreshToken,
    },
  });
}

export async function refresh(req: AuthRequest, res: Response) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw badRequest('Refresh token is required');
  }

  let decoded: { userId: string; role: string };
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw unauthorized('Invalid refresh token');
  }

  const tokenHash = hashToken(refreshToken);
  const stored = await RefreshToken.findOne({ tokenHash, user: decoded.userId });
  if (!stored) {
    throw unauthorized('Refresh token not found');
  }

  await RefreshToken.deleteOne({ _id: stored._id });

  const user = await User.findById(decoded.userId);
  if (!user || !user.active) {
    throw unauthorized('User not found or inactive');
  }

  const newAccessToken = signAccessToken({ userId: user._id.toString(), role: user.role });
  const newRefreshToken = signRefreshToken({ userId: user._id.toString(), role: user.role });

  await RefreshToken.create({
    user: user._id,
    tokenHash: hashToken(newRefreshToken),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.json({
    success: true,
    data: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    },
  });
}

export async function logout(req: AuthRequest, res: Response) {
  const { refreshToken } = req.body;
  if (refreshToken) {
    const tokenHash = hashToken(refreshToken);
    await RefreshToken.deleteOne({ tokenHash });
  }
  res.json({ success: true, message: 'Logged out successfully' });
}

export async function getMe(req: AuthRequest, res: Response) {
  if (!req.user) {
    throw unauthorized();
  }
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    throw notFound('User not found');
  }
  res.json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      state: user.state,
      pincode: user.pincode,
      role: user.role,
      active: user.active,
    },
  });
}

export async function updateProfile(req: AuthRequest, res: Response) {
  if (!req.user) throw unauthorized();
  const { name, phone, address, city, state, pincode } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) throw notFound('User not found');

  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (address !== undefined) user.address = address;
  if (city !== undefined) user.city = city;
  if (state !== undefined) user.state = state;
  if (pincode !== undefined) user.pincode = pincode;

  await user.save();

  res.json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      state: user.state,
      pincode: user.pincode,
      role: user.role,
    },
  });
}

export async function changePassword(req: AuthRequest, res: Response) {
  if (!req.user) throw unauthorized();
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw badRequest('Current password and new password are required');
  }

  const user = await User.findById(req.user.id).select('+password');
  if (!user) throw notFound('User not found');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw unauthorized('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  await RefreshToken.deleteMany({ user: user._id });

  const accessToken = signAccessToken({ userId: user._id.toString(), role: user.role });
  const refreshToken = signRefreshToken({ userId: user._id.toString(), role: user.role });

  await RefreshToken.create({
    user: user._id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.json({
    success: true,
    message: 'Password changed successfully',
    data: { accessToken, refreshToken },
  });
}
