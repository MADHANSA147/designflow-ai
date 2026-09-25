import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../middleware/auth.middleware';

export const createProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { idea, platform, targetAudience, designStyle, referenceInfo, workspaceId } = req.body;

    // Check workspace access
    const member = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: req.user.id } },
    });
    if (!member) {
      return next(new AppError('Unauthorized for this workspace', 403));
    }

    // AI MOCK: Generate project name from idea
    const projectName = idea.split(' ').slice(0, 3).join(' ') || 'New Project';

    const project = await prisma.project.create({
      data: {
        workspaceId,
        name: projectName,
        description: idea,
        status: 'IN_PROGRESS',
        productBrief: {
          create: {
            coreProblem: idea,
            targetAudience: targetAudience || 'General',
            toneOfVoice: designStyle || 'Professional',
          }
        }
      },
      include: {
        productBrief: true,
      }
    });

    res.status(201).json({ status: 'success', data: { project } });
  } catch (error) { next(error); }
};

export const getProjects = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { workspaceId, search, filter } = req.query;

    const where: any = {};
    
    if (workspaceId) {
      const member = await prisma.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId: String(workspaceId), userId: req.user.id } },
      });
      if (!member) return next(new AppError('Unauthorized', 403));
      where.workspaceId = String(workspaceId);
    } else {
      // Get all workspaces the user is part of
      const userWorkspaces = await prisma.workspaceMember.findMany({
        where: { userId: req.user.id },
        select: { workspaceId: true }
      });
      where.workspaceId = { in: userWorkspaces.map(w => w.workspaceId) };
    }

    if (search) {
      where.name = { contains: String(search), mode: 'insensitive' };
    }

    if (filter === 'favorites') {
      where.isFavorite = true;
    } else if (filter === 'archived') {
      where.status = 'ARCHIVED';
    } else {
      where.status = { not: 'ARCHIVED' };
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: {
          select: { screens: true, components: true }
        }
      }
    });

    res.status(200).json({ status: 'success', data: { projects } });
  } catch (error) { next(error); }
};

export const getProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        productBrief: true,
        uxPlan: true,
        designSystem: true,
      }
    });

    if (!project) return next(new AppError('Project not found', 404));

    // Verify access
    const member = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: project.workspaceId, userId: req.user.id } },
    });
    if (!member) return next(new AppError('Unauthorized', 403));

    res.status(200).json({ status: 'success', data: { project } });
  } catch (error) { next(error); }
};

export const updateProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;
    
    // Verify access
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return next(new AppError('Project not found', 404));

    const member = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: project.workspaceId, userId: req.user.id } },
    });
    if (!member) return next(new AppError('Unauthorized', 403));

    const updated = await prisma.project.update({
      where: { id },
      data: { name, description, status },
    });

    res.status(200).json({ status: 'success', data: { project: updated } });
  } catch (error) { next(error); }
};

export const deleteProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return next(new AppError('Project not found', 404));

    const member = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: project.workspaceId, userId: req.user.id } },
    });
    if (!member) return next(new AppError('Unauthorized', 403));

    await prisma.project.delete({ where: { id } });

    res.status(204).json({ status: 'success', data: null });
  } catch (error) { next(error); }
};

export const favoriteProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { isFavorite } = req.body;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return next(new AppError('Project not found', 404));

    const member = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: project.workspaceId, userId: req.user.id } },
    });
    if (!member) return next(new AppError('Unauthorized', 403));

    const updated = await prisma.project.update({
      where: { id },
      data: { isFavorite },
    });

    res.status(200).json({ status: 'success', data: { project: updated } });
  } catch (error) { next(error); }
};

export const getProjectStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return next(new AppError('Project not found', 404));

    const member = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: project.workspaceId, userId: req.user.id } },
    });
    if (!member) return next(new AppError('Unauthorized', 403));

    const screenCount = await prisma.screen.count({ where: { projectId: id } });
    const componentCount = await prisma.component.count({ where: { projectId: id } });
    const reviews = await prisma.aiReview.aggregate({
      where: { projectId: id },
      _avg: { score: true }
    });

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          screens: screenCount,
          components: componentCount,
          averageUxScore: reviews._avg.score || 0,
          status: project.status,
          updatedAt: project.updatedAt,
        }
      }
    });
  } catch (error) { next(error); }
};
