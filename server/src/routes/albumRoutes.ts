import { Router } from 'express';
import {
  getAlbums,
  getAlbumBySlug,
  createAlbum,
  updateAlbum,
  deleteAlbum,
} from '../controllers/albumController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { CreateAlbumSchema, UpdateAlbumSchema } from '../validation/schemas.js';

const router = Router();

// Public routes
router.get('/', getAlbums);
router.get('/:slug', getAlbumBySlug);

// Admin protected routes
router.post('/', requireAuth, validateBody(CreateAlbumSchema), createAlbum);
router.put('/:id', requireAuth, validateBody(UpdateAlbumSchema), updateAlbum);
router.delete('/:id', requireAuth, deleteAlbum);

export default router;
