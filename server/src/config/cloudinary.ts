import { v2 as cloudinary } from 'cloudinary';
import { config } from './index.js';

let configured = false;

export function configureCloudinary() {
  if (configured) return;
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
  configured = true;
}

export function isCloudinaryConfigured(): boolean {
  return !!(config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret);
}

export { cloudinary };
