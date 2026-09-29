import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = (name: string): string => {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const ENV = {
  PORT: requiredEnv('PORT'),
  NODE_ENV: requiredEnv('NODE_ENV'),
  CLIENT_URL: requiredEnv('CLIENT_URL'),
  MONGODB_URI: requiredEnv('MONGODB_URI'),
  JWT_SECRET: requiredEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: requiredEnv('JWT_EXPIRES_IN'),
  CLOUDINARY_CLOUD_NAME: requiredEnv('CLOUDINARY_CLOUD_NAME'),
  CLOUDINARY_API_KEY: requiredEnv('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET: requiredEnv('CLOUDINARY_API_SECRET'),
  EMAIL_HOST: requiredEnv('EMAIL_HOST'),
  EMAIL_PORT: Number(requiredEnv('EMAIL_PORT')),
  EMAIL_USER: requiredEnv('EMAIL_USER'),
  EMAIL_PASS: requiredEnv('EMAIL_PASS'),
  EMAIL_TO: requiredEnv('EMAIL_TO'),
  INSTAGRAM_ACCESS_TOKEN: process.env.INSTAGRAM_ACCESS_TOKEN || '',
};

if (!Number.isInteger(ENV.EMAIL_PORT) || ENV.EMAIL_PORT <= 0) {
  throw new Error('EMAIL_PORT must be a positive integer');
}

if (ENV.NODE_ENV === 'production') {
  const requiredProductionConfig = [
    ['JWT_SECRET', ENV.JWT_SECRET],
    ['CLOUDINARY_CLOUD_NAME', ENV.CLOUDINARY_CLOUD_NAME],
    ['CLOUDINARY_API_KEY', ENV.CLOUDINARY_API_KEY],
    ['CLOUDINARY_API_SECRET', ENV.CLOUDINARY_API_SECRET],
  ] as const;

  const missingConfig = requiredProductionConfig
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missingConfig.length > 0) {
    throw new Error(`Missing required production configuration: ${missingConfig.join(', ')}`);
  }
}
