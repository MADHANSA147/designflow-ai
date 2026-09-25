import { Router } from 'express';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth.middleware';
import * as accessibilityController from '../controllers/accessibility.controller';
import * as accessibilitySchema from '../validators/accessibility.validator';

const router = Router();

router.use(requireAuth);

router.get('/', accessibilityController.getReviews);
router.post('/run', validate(accessibilitySchema.accessibilityRequestSchema), accessibilityController.runAccessibilityReview);
router.post('/apply-fix', validate(accessibilitySchema.applyAccessibilityFixSchema), accessibilityController.applyFix);
router.post('/apply-all', validate(accessibilitySchema.applyAllFixesSchema), accessibilityController.applyAllFixes);

export default router;
