import { Router } from 'express';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth.middleware';
import * as prototypeController from '../controllers/prototype.controller';
import * as prototypeSchema from '../validators/prototype.validator';

const router = Router();

router.use(requireAuth);

router.post('/', validate(prototypeSchema.createPrototypeSchema), prototypeController.createPrototype);
router.get('/', prototypeController.getPrototype);

router.get('/:projectId/preview', prototypeController.previewPrototype);

router.post('/connections', validate(prototypeSchema.connectionSchema), prototypeController.createConnection);
router.patch('/connections/:id', validate(prototypeSchema.updateConnectionSchema), prototypeController.updateConnection);
router.delete('/connections/:id', prototypeController.deleteConnection);

export default router;
