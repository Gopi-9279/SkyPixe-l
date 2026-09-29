import { Router } from 'express';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { CreateTestimonialSchema } from '../validation/schemas.js';

const router = Router();

// Public
router.get('/', getTestimonials);

// Admin protected
router.post('/', requireAuth, validateBody(CreateTestimonialSchema), createTestimonial);
router.put('/:id', requireAuth, updateTestimonial);
router.delete('/:id', requireAuth, deleteTestimonial);

export default router;
