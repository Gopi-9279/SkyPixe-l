import { Router } from 'express';
import { getInstagramFeed } from '../controllers/instagramController.js';

const router = Router();

// Public — returns latest Instagram posts (cached)
router.get('/feed', getInstagramFeed);

export default router;
