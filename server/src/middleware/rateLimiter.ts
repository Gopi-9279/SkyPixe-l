import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts
  message: { success: false, message: 'Too many login attempts, please try again in 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15, // 15 inquiries per IP per hour
  message: { success: false, message: 'Too many inquiries sent from this IP, please wait before trying again' },
  standardHeaders: true,
  legacyHeaders: false,
});
