import mongoose from 'mongoose';
import { ENV } from './env.js';

export let isDbConnected = false;

export const connectDB = async (): Promise<boolean> => {
  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    isDbConnected = true;
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
    return true;
  } catch (error: any) {
    isDbConnected = false;
    console.warn(`[MongoDB] Could not connect to ${ENV.MONGODB_URI}: ${error.message}`);
    console.warn('[MongoDB] Running in Memory Mock Mode for development until MongoDB Atlas is configured in server/.env');
    return false;
  }
};
