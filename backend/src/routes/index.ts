import { Router } from 'express';
import healthRouter from './health';
import authRouter from './auth';
import projectRouter from './project';
import aiRouter from './ai';
import copilotRouter from './copilot';
import visionRouter from './vision';
import memoryRouter from './memory';
import prototypeRouter from './prototype';
import reviewRouter from './review';
import accessibilityRouter from './accessibility';
import versionRouter from './version';
import previewRouter from './preview';
import exportRouter from './export';
import assetRouter from './asset';

const router = Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/projects', projectRouter);
router.use('/ai', aiRouter);
router.use('/copilot', copilotRouter);
router.use('/vision', visionRouter);
router.use('/memory', memoryRouter);
router.use('/prototype', prototypeRouter);
router.use('/review', reviewRouter);
router.use('/accessibility', accessibilityRouter);
router.use('/versions', versionRouter);
router.use('/preview', previewRouter);
router.use('/export', exportRouter);
router.use('/assets', assetRouter);

export default router;
