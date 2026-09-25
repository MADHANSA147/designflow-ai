import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { AuthRequest } from './auth.middleware';

export const verifyProjectOwnership = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.projectId || req.body.projectId || req.query.projectId;
    if (!projectId) {
      return next(new AppError('ProjectId is required for this operation', 400));
    }

    const userId = req.user?.id;
    if (!userId) {
      return next(new AppError('Unauthorized', 401));
    }

    // A project belongs to a workspace, and a user belongs to a workspace.
    // Let's verify the user has access to the workspace that owns this project.
    const project = await prisma.project.findUnique({
      where: { id: String(projectId) },
      include: { workspace: true }
    });

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    const membership = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: project.workspaceId,
          userId: userId
        }
      }
    });

    if (!membership) {
      // Return 404 instead of 403 to prevent ID enumeration attacks
      return next(new AppError('Project not found', 404));
    }

    // Attach project to req to avoid duplicate DB queries down the line
    (req as any).project = project;

    next();
  } catch (error) {
    next(error);
  }
};
