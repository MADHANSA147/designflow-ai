import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../middleware/auth.middleware';

// COMPONENT LIBRARY
export const createComponent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId, name, description, baseStyles, variants } = req.body;

    const component = await prisma.component.create({
      data: {
        projectId,
        name,
        description,
        baseStyles: JSON.stringify(baseStyles || {}),
        variants: {
          create: variants ? variants.map((v: any) => ({
            name: v.name,
            props: JSON.stringify(v.props || {}),
          })) : []
        }
      },
      include: { variants: true }
    });

    res.status(201).json({ status: 'success', data: { component } });
  } catch (error) { next(error); }
};

export const getComponents = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.query;
    if (!projectId) return next(new AppError('ProjectId required', 400));

    const components = await prisma.component.findMany({
      where: { projectId: String(projectId) },
      include: { variants: true }
    });
    res.status(200).json({ status: 'success', data: { components } });
  } catch (error) { next(error); }
};

export const updateComponent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, baseStyles, variants } = req.body;

    const component = await prisma.component.update({
      where: { id },
      data: {
        name,
        description,
        baseStyles: baseStyles ? JSON.stringify(baseStyles) : undefined,
      },
    });

    // If variants exist, we just wipe and recreate for simplicity in this mockup, or upsert.
    if (variants) {
      await prisma.componentVariant.deleteMany({ where: { componentId: id } });
      await prisma.componentVariant.createMany({
        data: variants.map((v: any) => ({
          componentId: id,
          name: v.name,
          props: JSON.stringify(v.props || {}),
        }))
      });
    }

    const updated = await prisma.component.findUnique({
      where: { id },
      include: { variants: true }
    });

    res.status(200).json({ status: 'success', data: { component: updated } });
  } catch (error) { next(error); }
};

export const deleteComponent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.component.delete({ where: { id } });
    res.status(204).send();
  } catch (error) { next(error); }
};

export const duplicateComponent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const existing = await prisma.component.findUnique({
      where: { id },
      include: { variants: true }
    });
    
    if (!existing) return next(new AppError('Not found', 404));

    const component = await prisma.component.create({
      data: {
        projectId: existing.projectId,
        name: `${existing.name} (Copy)`,
        description: existing.description,
        baseStyles: existing.baseStyles,
        variants: {
          create: existing.variants.map((v: any) => ({
            name: v.name,
            props: v.props,
          }))
        }
      },
      include: { variants: true }
    });
    res.status(201).json({ status: 'success', data: { component } });
  } catch (error) { next(error); }
};

// DESIGN MEMORY
export const updateDesignMemory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId, ...memoryData } = req.body;

    const memory = await prisma.designMemory.upsert({
      where: { projectId },
      update: memoryData,
      create: { projectId, ...memoryData }
    });

    res.status(200).json({ status: 'success', data: { memory } });
  } catch (error) { next(error); }
};

export const getDesignMemory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.query;
    if (!projectId) return next(new AppError('ProjectId required', 400));

    const memory = await prisma.designMemory.findUnique({
      where: { projectId: String(projectId) },
    });
    
    res.status(200).json({ status: 'success', data: { memory } });
  } catch (error) { next(error); }
};
