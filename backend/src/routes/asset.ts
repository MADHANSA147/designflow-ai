import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import * as assetController from '../controllers/asset.controller';

const router = Router();

router.use(requireAuth);

router.post('/upload', upload.single('file'), assetController.uploadAsset);
router.get('/:id/url', assetController.getAssetUrl);
router.delete('/:id', assetController.deleteAsset);

export default router;
