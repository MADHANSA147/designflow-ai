import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../middleware/auth.middleware';
import { visionService } from '../services/vision.service';

export const analyzeImage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId, imageUrl, type, context } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) return next(new AppError('Project not found', 404));

    const member = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: project.workspaceId, userId: req.user.id } },
    });
    if (!member) return next(new AppError('Unauthorized', 403));

    // Store the asset reference
    const asset = await prisma.asset.create({
      data: {
        projectId,
        name: `${type}_Upload_${Date.now()}`,
        url: imageUrl,
        type: 'IMAGE',
      }
    });

    // Run Vision AI
    const result = await visionService.processImage(imageUrl, type, context);

    // Get or create conversation for vision flow
    let conversation = await prisma.aIConversation.findFirst({
      where: { projectId, context: 'Multimodal Vision Flow' }
    });

    if (!conversation) {
      conversation = await prisma.aIConversation.create({
        data: { projectId, context: 'Multimodal Vision Flow' }
      });
    }

    // Store analysis result and generated schema
    const generation = await prisma.aIGeneration.create({
      data: {
        conversationId: conversation.id,
        type: 'VISION_SCREEN',
        payload: JSON.stringify({
          analysisResult: result.analysisResult,
          uiSchema: result.generatedUI,
          assetId: asset.id
        }),
        applied: false,
      }
    });

    res.status(200).json({
      status: 'success',
      data: {
        generationId: generation.id,
        analysisResult: result.analysisResult,
        uiSchema: result.generatedUI,
        assetUrl: asset.url
      }
    });
  } catch (error) { next(error); }
};

export const applyVisionScreen = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId, generationId, screenName } = req.body;

    const generation = await prisma.aIGeneration.findUnique({ where: { id: generationId } });
    if (!generation || generation.applied) return next(new AppError('Invalid or already applied generation', 400));

    const payload = JSON.parse(generation.payload);
    
    // Save to Database as a new Screen
    const screen = await prisma.screen.create({
      data: {
        projectId,
        name: screenName,
        description: `Generated from vision analysis`,
        layout: JSON.stringify({ type: 'flex', direction: 'column' }),
        componentTree: JSON.stringify(payload.uiSchema),
        styles: JSON.stringify(payload.uiSchema.styles || {}),
        responsiveBehavior: JSON.stringify({}),
        interactions: JSON.stringify({}),
      }
    });

    // Mark applied
    await prisma.aIGeneration.update({
      where: { id: generationId },
      data: { applied: true },
    });

    res.status(200).json({ status: 'success', data: { screen } });
  } catch (error) { next(error); }
};
