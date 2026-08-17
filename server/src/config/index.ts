import dotenv from 'dotenv';

dotenv.config();

const required = ['JWT_SECRET', 'JWT_REFRESH_SECRET'] as const;
for (const key of required) {
  if (!process.env[key]) {
    console.warn(`Warning: ${key} is not set in .env — using a dev fallback. Set this in production!`);
  }
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'mmc_dev_jwt_secret_fallback',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'mmc_dev_refresh_secret_fallback',
  jwtExpiresIn: '15m',
  jwtRefreshExpiresIn: '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  whatsappNumber: process.env.WHATSAPP_NUMBER || '919876543210',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
};
