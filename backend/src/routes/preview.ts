import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import * as previewController from '../controllers/preview.controller';

const router = Router();

router.use(requireAuth);

router.get('/data', previewController.getPreviewData);
router.post('/sandbox', previewController.getSandboxedPreview);

export default router;
