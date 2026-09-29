import { Router } from 'express';
import {
  submitInquiry,
  getInquiries,
  updateInquiryStatus,
} from '../controllers/inquiryController.js';
import { requireAuth } from '../middleware/auth.js';
import { inquiryLimiter } from '../middleware/rateLimiter.js';
import { validateBody } from '../middleware/validate.js';
import { InquirySchema } from '../validation/schemas.js';

const router = Router();

// Public inquiry submission
router.post('/', inquiryLimiter, validateBody(InquirySchema), submitInquiry);

// Admin protected endpoints
router.get('/', requireAuth, getInquiries);
router.patch('/:id/status', requireAuth, updateInquiryStatus);

export default router;
