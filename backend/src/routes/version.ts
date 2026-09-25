import { Router } from 'express';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth.middleware';
import * as versionController from '../controllers/version.controller';
import * as versionSchema from '../validators/version.validator';

const router = Router();

router.use(requireAuth);

router.get('/', versionController.listVersions);
router.post('/', validate(versionSchema.createVersionSchema), versionController.createVersion);
router.get('/:id', versionController.getVersion);
router.post('/restore', validate(versionSchema.restoreVersionSchema), versionController.restoreVersion);

export default router;
