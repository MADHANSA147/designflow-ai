import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import * as aiController from '../controllers/ai.controller';

const router = Router();

router.use(requireAuth);

router.post('/generate', aiController.startGeneration);
router.get('/jobs/:id', aiController.getGenerationJob);

export default router;
