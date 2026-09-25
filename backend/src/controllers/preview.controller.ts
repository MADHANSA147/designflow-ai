import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../middleware/auth.middleware';

// Fetches the structured UI tree safely for the frontend runtime renderer
export const getPreviewData = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId, screenId } = req.query;

    if (!projectId || !screenId) {
      return next(new AppError('projectId and screenId are required', 400));
    }

    const project = await prisma.project.findUnique({
      where: { id: String(projectId) },
      include: {
        designSystem: {
          include: { colors: true, typography: true, spacing: true }
        },
        components: {
          include: { variants: true }
        }
      }
    });

    if (!project) return next(new AppError('Project not found', 404));

    const screen = await prisma.screen.findUnique({
      where: { id: String(screenId) }
    });

    if (!screen) return next(new AppError('Screen not found', 404));

    // The frontend renderer will parse this JSON and map it to native React components
    res.status(200).json({
      status: 'success',
      data: {
        designSystem: project.designSystem,
        components: project.components,
        screen: {
          id: screen.id,
          name: screen.name,
          componentTree: JSON.parse(screen.componentTree),
          styles: screen.styles ? JSON.parse(screen.styles) : {},
        }
      }
    });
  } catch (error) { next(error); }
};

// Placeholder for Future: Executing exported raw React code in a sandboxed container (e.g. Docker / WebContainers)
export const getSandboxedPreview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // 1. Fetch generated code from DB
    // 2. Request ephemeral container from Container Engine API
    // 3. Deploy code to container
    // 4. Return secure iframe URL to client
    
    res.status(501).json({
      status: 'error',
      message: 'Sandboxed code execution is planned for a future release. Currently using structured schema rendering.'
    });
  } catch (error) { next(error); }
};
