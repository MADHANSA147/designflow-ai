import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../middleware/auth.middleware';

export const createPrototype = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.body;
    
    // Upsert since it's 1-to-1 with project
    const prototype = await prisma.prototype.upsert({
      where: { projectId },
      update: {},
      create: { projectId },
      include: { connections: true }
    });

    res.status(201).json({ status: 'success', data: { prototype } });
  } catch (error) { next(error); }
};

export const getPrototype = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.query;
    if (!projectId) return next(new AppError('projectId is required', 400));

    const prototype = await prisma.prototype.findUnique({
      where: { projectId: String(projectId) },
      include: { connections: true }
    });

    if (!prototype) return next(new AppError('Prototype not found', 404));

    res.status(200).json({ status: 'success', data: { prototype } });
  } catch (error) { next(error); }
};

export const createConnection = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { prototypeId, sourceScreenId, targetScreenId, trigger, triggerNodeId, actionType, actionData, animation } = req.body;

    const connection = await prisma.prototypeConnection.create({
      data: {
        prototypeId,
        sourceScreenId,
        targetScreenId,
        trigger,
        triggerNodeId,
        actionType,
        actionData,
        animation
      }
    });

    res.status(201).json({ status: 'success', data: { connection } });
  } catch (error) { next(error); }
};

export const updateConnection = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const connection = await prisma.prototypeConnection.update({
      where: { id },
      data: updates
    });

    res.status(200).json({ status: 'success', data: { connection } });
  } catch (error) { next(error); }
};

export const deleteConnection = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.prototypeConnection.delete({ where: { id } });
    res.status(204).send();
  } catch (error) { next(error); }
};

export const previewPrototype = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;

    const prototype = await prisma.prototype.findUnique({
      where: { projectId },
      include: {
        connections: true,
      }
    });

    if (!prototype) return next(new AppError('Prototype not found', 404));

    // Also fetch all screens so the frontend preview engine has the whole payload
    const screens = await prisma.screen.findMany({
      where: { projectId }
    });

    res.status(200).json({ status: 'success', data: { prototype, screens } });
  } catch (error) { next(error); }
};
