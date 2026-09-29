import { v2 as cloudinary } from 'cloudinary';
import { ENV } from '../config/env.js';

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
  secure: true,
});

const isCloudinaryConfigured = (): boolean => Boolean(
  ENV.CLOUDINARY_CLOUD_NAME && ENV.CLOUDINARY_API_KEY && ENV.CLOUDINARY_API_SECRET
);

const assertCloudinaryConfigured = (): void => {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured');
  }
};

const isAllowedFolder = (folder: string): boolean =>
  /^skypixel(?:\/[a-zA-Z0-9_-]+)+$/.test(folder);

export const generateUploadSignature = (folder: string = 'skypixel/general') => {
  if (!isAllowedFolder(folder)) {
    throw new Error('Invalid Cloudinary upload folder');
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  
  if (!isCloudinaryConfigured()) {
    if (ENV.NODE_ENV === 'production') {
      assertCloudinaryConfigured();
    }

    // In mock/dev mode when real secret is not yet set
    return {
      timestamp,
      signature: 'mock_signature_for_dev_mode',
      apiKey: ENV.CLOUDINARY_API_KEY,
      cloudName: ENV.CLOUDINARY_CLOUD_NAME,
      folder,
    };
  }

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    ENV.CLOUDINARY_API_SECRET
  );

  return {
    timestamp,
    signature,
    apiKey: ENV.CLOUDINARY_API_KEY,
    cloudName: ENV.CLOUDINARY_CLOUD_NAME,
    folder,
  };
};

export const deleteCloudinaryMedia = async (publicId: string, resourceType: 'image' | 'video' = 'image') => {
  if (!publicId.startsWith('skypixel/')) {
    throw new Error('Invalid Cloudinary public ID');
  }

  if (!isCloudinaryConfigured()) {
    if (ENV.NODE_ENV === 'production') {
      assertCloudinaryConfigured();
    }

    console.log(`[Cloudinary Mock] Pretending to delete ${resourceType}: ${publicId}`);
    return { result: 'ok' };
  }
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return result;
  } catch (error) {
    console.error(`[Cloudinary] Failed to delete ${publicId}:`, error);
    throw error;
  }
};

export default cloudinary;
