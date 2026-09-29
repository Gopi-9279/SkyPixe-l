import { Router } from 'express';
import {
  getTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../controllers/teamController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { CreateTeamMemberSchema } from '../validation/schemas.js';

const router = Router();

// Public
router.get('/', getTeam);

// Admin protected
router.post('/', requireAuth, validateBody(CreateTeamMemberSchema), createTeamMember);
router.put('/:id', requireAuth, updateTeamMember);
router.delete('/:id', requireAuth, deleteTeamMember);

export default router;
