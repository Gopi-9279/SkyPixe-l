import { Router } from 'express';
import {
  getShowcase,
  getUploadParams,
  addShowcaseImage,
  deleteShowcaseImage,
} from '../controllers/showcaseController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Public route
router.get('/', getShowcase);

// Admin protected routes
router.get('/upload-params', requireAuth, getUploadParams);
router.post('/', requireAuth, addShowcaseImage);
router.delete('/:id', requireAuth, deleteShowcaseImage);

export default router;
