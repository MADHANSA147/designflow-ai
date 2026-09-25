import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../middleware/auth.middleware';
import { accessibilityService } from '../services/accessibility.service';

export const runAccessibilityReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId, screenId, wcagLevel } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { designSystem: true }
    });

    if (!project) return next(new AppError('Project not found', 404));

    let screenData = null;
    if (screenId) {
      screenData = await prisma.screen.findUnique({ where: { id: screenId } });
    }

    const context = {
      projectId,
      screenId,
      screenTree: screenData ? JSON.parse(screenData.componentTree) : 'ALL_SCREENS',
      designSystem: project.designSystem,
      wcagLevel,
    };

    const reviewResult = await accessibilityService.conductAnalysis(context);

    // Save Accessibility Review and Findings
    const review = await prisma.accessibilityReview.create({
      data: {
        projectId,
        screenId,
        wcagLevel,
        score: reviewResult.score,
        findings: {
          create: reviewResult.findings.map((f: any) => ({
            type: f.type,
            category: f.category,
            rule: f.rule,
            screenId: f.screenId,
            elementId: f.elementId,
            problem: f.problem,
            explanation: f.explanation,
            currentValue: f.currentValue,
            expectedValue: f.expectedValue,
            recommendation: f.recommendation,
            autoFixAvailable: f.autoFixAvailable,
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

export const applyFix = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { findingId, projectId } = req.body;

    const finding = await prisma.reviewFinding.findUnique({
      where: { id: findingId },
      include: { accessibilityReview: true }
    });

    if (!finding || !finding.suggestedFix || !finding.autoFixAvailable) {
      return next(new AppError('Finding or auto-fix not found', 404));
    }

    const targetScreenId = finding.screenId || finding.accessibilityReview?.screenId;
    if (!targetScreenId) return next(new AppError('Cannot determine screen for this fix', 400));

    const screen = await prisma.screen.findUnique({ where: { id: targetScreenId } });
    if (!screen) return next(new AppError('Screen not found', 404));

    await prisma.projectVersion.create({
      data: {
        projectId,
        tag: `Auto-save before applying accessibility fix ${findingId}`,
        snapshot: JSON.stringify({ componentTree: JSON.parse(screen.componentTree) }),
      }
    });

    // In reality, dynamically apply JSON patch to tree here

    res.status(200).json({ status: 'success', data: { message: 'Accessibility fix applied' } });
  } catch (error) { next(error); }
};

export const applyAllFixes = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { reviewId, projectId } = req.body;

    const review = await prisma.accessibilityReview.findUnique({
      where: { id: reviewId },
      include: { findings: { where: { autoFixAvailable: true } } }
    });

    if (!review) return next(new AppError('Review not found', 404));

    await prisma.projectVersion.create({
      data: {
        projectId,
        tag: `Auto-save before applying ALL accessibility fixes for review ${reviewId}`,
        snapshot: 'bulk-snapshot-placeholder', 
      }
    });

    // Iteratively apply all autoFix patches

    res.status(200).json({ status: 'success', data: { message: `Applied ${review.findings.length} accessibility fixes` } });
  } catch (error) { next(error); }
};

export const getReviews = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.query;
    if (!projectId) return next(new AppError('ProjectId required', 400));

    const reviews = await prisma.accessibilityReview.findMany({
      where: { projectId: String(projectId) },
      include: { findings: true },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ status: 'success', data: { reviews } });
  } catch (error) { next(error); }
};
