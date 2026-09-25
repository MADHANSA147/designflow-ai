import { Router } from 'express';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth.middleware';
import * as visionController from '../controllers/vision.controller';
import * as visionSchema from '../validators/vision.validator';

const router = Router();

router.use(requireAuth);

router.post('/analyze', validate(visionSchema.analyzeImageSchema), visionController.analyzeImage);
router.post('/apply', validate(visionSchema.applyVisionScreenSchema), visionController.applyVisionScreen);

export default router;
