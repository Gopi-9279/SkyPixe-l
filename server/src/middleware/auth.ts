import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

export interface AuthRequest extends Request {
  adminId?: string;
  adminEmail?: string;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as { id: string; email: string };
    req.adminId = decoded.id;
    req.adminEmail = decoded.email;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired session token' });
  }
};
