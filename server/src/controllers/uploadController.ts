import type { Response } from 'express';
import multer from 'multer';
import { cloudinary, isCloudinaryConfigured, configureCloudinary } from '../config/cloudinary.js';
import { badRequest } from '../utils/errors.js';
import type { AuthRequest } from '../middleware/auth.js';

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

export async function uploadImage(req: AuthRequest, res: Response) {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    throw badRequest('No image files uploaded');
  }

  const files = req.files as Express.Multer.File[];

  if (isCloudinaryConfigured()) {
    configureCloudinary();
    const results = await Promise.all(
      files.map(async (file) => {
        const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'manoj-matching-centre', resource_type: 'image' },
            (err, result) => {
              if (err) reject(err);
              else resolve({ secure_url: result!.secure_url, public_id: result!.public_id });
            }
          );
          stream.end(file.buffer);
        });
        return { url: result.secure_url, publicId: result.public_id };
      })
    );
    res.json({ success: true, data: results });
  } else {
    const results = files.map((file) => {
      const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      return { url: base64, publicId: `local-${Date.now()}-${file.originalname}` };
    });
    res.json({ success: true, data: results, message: 'Cloudinary not configured — returning base64 images for development' });
  }
}

export async function deleteImage(req: AuthRequest, res: Response) {
  const { publicId } = req.body;

  if (!publicId) {
    throw badRequest('Public ID is required');
  }

  if (isCloudinaryConfigured() && !publicId.startsWith('local-')) {
    configureCloudinary();
    await cloudinary.uploader.destroy(publicId);
  }

  res.json({ success: true, message: 'Image deleted successfully' });
}
