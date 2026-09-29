import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { ENV } from '../config/env.js';
import { isDbConnected } from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';

const DEFAULT_ADMIN_EMAIL = 'admin@skypixel.com';
const DEFAULT_ADMIN_PASS = 'Skypixel2026!';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  let isValid = false;
  let adminId = 'admin-default';

  if (isDbConnected) {
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (admin && (await bcrypt.compare(password, admin.passwordHash))) {
      isValid = true;
      adminId = admin._id.toString();
    }
  } else {
    // Memory / Development fallback
    if (email.toLowerCase() === DEFAULT_ADMIN_EMAIL && password === DEFAULT_ADMIN_PASS) {
      isValid = true;
    }
  }

  if (!isValid) {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
    return;
  }

  const token = jwt.sign({ id: adminId, email: email.toLowerCase() }, ENV.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    message: 'Logged in successfully',
    token,
    user: { email: email.toLowerCase(), role: 'admin' },
  });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({
    success: true,
    user: {
      id: req.adminId,
      email: req.adminEmail,
      role: 'admin',
    },
  });
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });
  res.json({ success: true, message: 'Logged out successfully' });
};
