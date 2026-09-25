import { Router } from 'express';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth.middleware';
import * as memoryController from '../controllers/memory.controller';
import * as memorySchema from '../validators/memory.validator';

const router = Router();

router.use(requireAuth);

// Components
router.get('/components', memoryController.getComponents);
router.post('/components', validate(memorySchema.createComponentSchema), memoryController.createComponent);
router.patch('/components/:id', validate(memorySchema.updateComponentSchema), memoryController.updateComponent);
router.delete('/components/:id', memoryController.deleteComponent);
router.post('/components/:id/duplicate', memoryController.duplicateComponent);

// Design Memory
router.get('/', memoryController.getDesignMemory);
router.post('/', validate(memorySchema.designMemorySchema), memoryController.updateDesignMemory);

export default router;
