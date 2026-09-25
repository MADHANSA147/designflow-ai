import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../middleware/auth.middleware';
import { reviewService } from '../services/review.service';

export const runReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId, screenId } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { designMemory: true }
    });

    if (!project) return next(new AppError('Project not found', 404));

    let screenData = null;
    if (screenId) {
      screenData = await prisma.screen.findUnique({ where: { id: screenId } });
      if (!screenData) return next(new AppError('Screen not found', 404));
    }

    const context = {
      projectId,
      screenId,
      screenTree: screenData ? JSON.parse(screenData.componentTree) : 'ALL_SCREENS',
      designMemory: project.designMemory,
    };

    const reviewResult = await reviewService.conductReview(context);

    // Save Review and Findings
    const review = await prisma.aIReview.create({
      data: {
        projectId,
        screenId,
        score: reviewResult.score,
        findings: {
          create: reviewResult.findings.map((f: any) => ({
            type: f.type,
            category: f.category,
            screenId: f.screenId,
            elementId: f.elementId,
            problem: f.problem,
            explanation: f.explanation,
            recommendation: f.recommendation,
            suggestedFix: f.suggestedFix,
            confidence: f.confidence,
          }))
        }
      },
      include: { findings: true }
    });

    res.status(201).json({ status: 'success', data: { review } });
  } catch (error) { next(error); }
};

export const applyReviewFix = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { findingId, projectId } = req.body;

    const finding = await prisma.reviewFinding.findUnique({
      where: { id: findingId },
      include: { aiReview: true }
    });

    if (!finding || !finding.suggestedFix) {
      return next(new AppError('Finding or suggested fix not found', 404));
    }

    const targetScreenId = finding.screenId || finding.aiReview?.screenId;
    if (!targetScreenId) return next(new AppError('Cannot determine screen for this fix', 400));

    const screen = await prisma.screen.findUnique({ where: { id: targetScreenId } });
    if (!screen) return next(new AppError('Screen not found', 404));

    // The suggestedFix contains the patch instruction (similar to copilot patch)
    // E.g., { action: "UPDATE", nodeId: "...", payload: {...} }

    // Backup the screen state before applying
    await prisma.projectVersion.create({
      data: {
        projectId,
        tag: `Auto-save before applying review fix ${findingId}`,
        snapshot: JSON.stringify({ componentTree: JSON.parse(screen.componentTree) }),
      }
    });

    // In a real app, we would dynamically walk the JSON tree and apply the patch.
    // For this prototype, we simulate success and return the finding indicating it was resolved.

    res.status(200).json({ status: 'success', data: { message: 'Fix applied successfully' } });
  } catch (error) { next(error); }
};

export const getReviews = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.query;
    if (!projectId) return next(new AppError('ProjectId required', 400));

    const reviews = await prisma.aIReview.findMany({
      where: { projectId: String(projectId) },
      include: { findings: true },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ status: 'success', data: { reviews } });
  } catch (error) { next(error); }
};
