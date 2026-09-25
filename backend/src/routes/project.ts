import { Router } from 'express';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth.middleware';
import * as projectController from '../controllers/project.controller';
import * as projectSchema from '../validators/project.validator';

const router = Router();

router.use(requireAuth);

router.post('/', validate(projectSchema.createProjectSchema), projectController.createProject);
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProject);
router.patch('/:id', validate(projectSchema.updateProjectSchema), projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
router.patch('/:id/favorite', validate(projectSchema.favoriteProjectSchema), projectController.favoriteProject);
router.get('/:id/stats', projectController.getProjectStats);

export default router;
