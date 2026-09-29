import { Router } from 'express';
import { login, getMe, logout } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiter.js';
import { validateBody } from '../middleware/validate.js';
import { LoginSchema } from '../validation/schemas.js';

const router = Router();

router.post('/login', loginLimiter, validateBody(LoginSchema), login);
router.get('/me', requireAuth, getMe);
router.post('/logout', logout);

export default router;
