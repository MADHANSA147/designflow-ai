import { Router } from 'express';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth.middleware';
import * as exportController from '../controllers/export.controller';
import * as exportSchema from '../validators/export.validator';

const router = Router();

router.use(requireAuth);

router.get('/', exportController.listExportJobs);
router.post('/start', validate(exportSchema.startExportSchema), exportController.startExport);
router.get('/:id', exportController.getExportJob);

export default router;
