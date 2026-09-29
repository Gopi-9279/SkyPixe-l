import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ENV } from '../config/env.js';
import { Admin } from '../models/Admin.js';

const ADMIN_EMAIL = 'admin@skypixel.com';
const ADMIN_PASSWORD = 'Skypixel2026!';

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(ENV.MONGODB_URI);
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await Admin.findOneAndUpdate(
      { email: ADMIN_EMAIL },
      { email: ADMIN_EMAIL, passwordHash },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`Admin account is ready: ${ADMIN_EMAIL}`);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedDatabase();
