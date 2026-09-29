import { Router } from 'express';
import {
  getUploadParams,
  addMedia,
  deleteMedia,
  setAlbumCover,
} from '../controllers/mediaController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { CreateMediaSchema } from '../validation/schemas.js';

const router = Router();

// Admin protected routes
router.get('/upload-params', requireAuth, getUploadParams);
router.post('/', requireAuth, validateBody(CreateMediaSchema), addMedia);
router.delete('/:id', requireAuth, deleteMedia);
router.post('/set-cover', requireAuth, setAlbumCover);

export default router;
