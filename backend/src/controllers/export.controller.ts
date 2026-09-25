import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../middleware/auth.middleware';
import { exportService } from '../services/export.service';

export const startExport = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId, format, selectedScreens } = req.body;

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return next(new AppError('Project not found', 404));

    const job = await prisma.exportJob.create({
      data: {
        projectId,
        format,
        selectedScreens,
        status: 'PENDING',
        progress: 0,
      }
    });

    // Fire and forget background process
    exportService.processExportJob(job.id);

    res.status(202).json({ status: 'success', data: { job } });
  } catch (error) { next(error); }
};

export const getExportJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const job = await prisma.exportJob.findUnique({ where: { id } });
    if (!job) return next(new AppError('Export job not found', 404));

    res.status(200).json({ status: 'success', data: { job } });
  } catch (error) { next(error); }
};

export const listExportJobs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.query;
    if (!projectId) return next(new AppError('ProjectId required', 400));

    const jobs = await prisma.exportJob.findMany({
      where: { projectId: String(projectId) },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ status: 'success', data: { jobs } });
  } catch (error) { next(error); }
};
