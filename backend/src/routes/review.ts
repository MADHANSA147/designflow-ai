import { Router } from 'express';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth.middleware';
import * as reviewController from '../controllers/review.controller';
import * as reviewSchema from '../validators/review.validator';

const router = Router();

router.use(requireAuth);

router.get('/', reviewController.getReviews);
router.post('/run', validate(reviewSchema.reviewRequestSchema), reviewController.runReview);
router.post('/apply-fix', validate(reviewSchema.applyFixSchema), reviewController.applyReviewFix);

export default router;
