import type { Response } from 'express';
import { BusinessSettings } from '../models/BusinessSettings.js';
import { notFound } from '../utils/errors.js';
import type { AuthRequest } from '../middleware/auth.js';

export async function getSettings(_req: AuthRequest, res: Response) {
  let settings = await BusinessSettings.findOne();
  if (!settings) {
    settings = await BusinessSettings.create({});
  }
  res.json({ success: true, data: settings });
}

export async function updateSettings(req: AuthRequest, res: Response) {
  const updates = req.body;
  delete updates._id;

  let settings = await BusinessSettings.findOne();
  if (!settings) {
    settings = new BusinessSettings(updates);
    await settings.save();
  } else {
    Object.assign(settings, updates);
    await settings.save();
  }

  res.json({ success: true, data: settings });
}
