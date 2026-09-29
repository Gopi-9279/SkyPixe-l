import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getSettings, updateSettings } from '../controllers/settingsController.js';

const router = Router();

router.get('/', getSettings);
router.put('/', requireAuth, updateSettings);

export default router;