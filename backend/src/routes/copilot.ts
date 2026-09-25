import { Router } from 'express';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth.middleware';
import * as copilotController from '../controllers/copilot.controller';
import * as copilotSchema from '../validators/copilot.validator';

const router = Router();

router.use(requireAuth);

router.post('/ask', validate(copilotSchema.copilotRequestSchema), copilotController.askCopilot);
router.post('/apply', validate(copilotSchema.applyPatchSchema), copilotController.applyCopilotPatch);

export default router;
