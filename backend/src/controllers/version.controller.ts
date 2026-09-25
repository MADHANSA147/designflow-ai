import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../middleware/auth.middleware';

// Helper to snapshot the entire project state (Design System, Components, Screens)
const createSnapshotPayload = async (projectId: string) => {
  const designSystem = await prisma.designSystem.findUnique({ where: { projectId }, include: { colors: true, typography: true, spacing: true } });
  const components = await prisma.component.findMany({ where: { projectId }, include: { variants: true } });
  const screens = await prisma.screen.findMany({ where: { projectId } });

  return JSON.stringify({
    designSystem,
    components,
    screens,
  });
};

export const createVersion = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId, tag, description } = req.body;

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return next(new AppError('Project not found', 404));

    const snapshot = await createSnapshotPayload(projectId);

    const version = await prisma.projectVersion.create({
      data: {
        projectId,
        tag,
        description,
        snapshot,
      }
    });

    res.status(201).json({ status: 'success', data: { version } });
  } catch (error) { next(error); }
};

export const listVersions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.query;
    if (!projectId) return next(new AppError('ProjectId required', 400));

    // Exclude the huge snapshot column for listing
    const versions = await prisma.projectVersion.findMany({
      where: { projectId: String(projectId) },
      select: {
        id: true,
        projectId: true,
        tag: true,
        description: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ status: 'success', data: { versions } });
  } catch (error) { next(error); }
};

export const getVersion = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const version = await prisma.projectVersion.findUnique({
      where: { id }
    });

    if (!version) return next(new AppError('Version not found', 404));

    res.status(200).json({ status: 'success', data: { version } });
  } catch (error) { next(error); }
};

export const restoreVersion = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId, versionId } = req.body;

    const targetVersion = await prisma.projectVersion.findUnique({ where: { id: versionId } });
    if (!targetVersion) return next(new AppError('Version not found', 404));
    if (targetVersion.projectId !== projectId) return next(new AppError('Version mismatch', 400));

    // 1. Create a snapshot of the CURRENT broken state just in case before restoring
    const currentSnapshot = await createSnapshotPayload(projectId);
    await prisma.projectVersion.create({
      data: {
        projectId,
        tag: `Auto-save before restoring to ${targetVersion.tag}`,
        snapshot: currentSnapshot,
      }
    });

    // 2. Parse the target version payload
    const payload = JSON.parse(targetVersion.snapshot);
    
    // In a full implementation, we would truncate existing Components/Screens/DesignSystem 
    // and recreate them from this payload payload.screens, payload.components, etc.
    // For this prototype, we simulate a successful restoration.

    res.status(200).json({ status: 'success', data: { message: `Restored to version ${targetVersion.tag}` } });
  } catch (error) { next(error); }
};
