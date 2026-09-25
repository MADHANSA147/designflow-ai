import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../middleware/auth.middleware';
import { copilotService } from '../services/copilot.service';

export const askCopilot = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId, screenId, selectedComponentId, prompt } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { designSystem: true, designMemory: true }
    });

    if (!project) return next(new AppError('Project not found', 404));

    const member = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: project.workspaceId, userId: req.user.id } },
    });
    if (!member) return next(new AppError('Unauthorized', 403));

    let screenData = null;
    if (screenId) {
      screenData = await prisma.screen.findUnique({ where: { id: screenId } });
    }

    // Get previous conversation if exists (we will just create a new one or use the first for simplicity in this mock)
    let conversation = await prisma.aIConversation.findFirst({
      where: { projectId },
      orderBy: { createdAt: 'desc' }
    });

    if (!conversation) {
      conversation = await prisma.aIConversation.create({
        data: { projectId, context: 'Design Copilot Session' }
      });
    }

    // Save user message
    await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'USER',
        content: prompt,
      }
    });

    // Build Context
    const context = {
      project: { name: project.name, description: project.description },
      designSystem: project.designSystem,
      designMemory: project.designMemory,
      screen: screenData ? JSON.parse(screenData.componentTree) : null,
      selectedComponentId,
    };

    // Ask AI
    const aiResponse = await copilotService.processRequest(prompt, context);

    // Save AI response message
    await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'AI',
        content: aiResponse.reasoning,
      }
    });

    // Save Generation (the patch)
    const generation = await prisma.aIGeneration.create({
      data: {
        conversationId: conversation.id,
        type: 'SCREEN_PATCH',
        payload: JSON.stringify(aiResponse.patches),
        applied: false,
      }
    });

    // If there is memory learning, we could append it to DesignMemory here.
    // E.g., if user says "Always use darker shadows", append to project.designMemory.uxPrinciples

    res.status(200).json({
      status: 'success',
      data: {
        generationId: generation.id,
        intent: aiResponse.intent,
        reasoning: aiResponse.reasoning,
        patches: aiResponse.patches,
      }
    });
  } catch (error) { next(error); }
};

export const applyCopilotPatch = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId, screenId, generationId } = req.body;

    const generation = await prisma.aIGeneration.findUnique({ where: { id: generationId } });
    if (!generation || generation.applied) return next(new AppError('Invalid or already applied generation', 400));

    const screen = await prisma.screen.findUnique({ where: { id: screenId } });
    if (!screen) return next(new AppError('Screen not found', 404));

    const patches = JSON.parse(generation.payload);
    const tree = JSON.parse(screen.componentTree);

    // SIMPLE PATCH APPLICATION MOCK
    // In reality, this requires recursive traversal to apply the diff correctly to the structured tree
    
    // We update the generation status to applied
    await prisma.aIGeneration.update({
      where: { id: generationId },
      data: { applied: true },
    });

    // Create a version snapshot before saving
    await prisma.projectVersion.create({
      data: {
        projectId,
        tag: `Auto-save before applying generation ${generationId}`,
        snapshot: JSON.stringify({ componentTree: tree }),
      }
    });

    // Update screen
    // (Here we just save it back unchanged in the mock, but the frontend would likely render the applied tree and send the full tree back via updateScreen)
    
    res.status(200).json({ status: 'success', data: { message: 'Patch applied successfully' } });
  } catch (error) { next(error); }
};
