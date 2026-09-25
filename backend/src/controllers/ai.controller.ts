import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../middleware/auth.middleware';
import { aiQueue } from '../queue';

export const startGeneration = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { conversationId, type, prompt, context } = req.body;

    const conversation = await prisma.aIConversation.findUnique({ where: { id: conversationId } });
    if (!conversation) return next(new AppError('Conversation not found', 404));

    // Create a pending generation job
    const generation = await prisma.aIGeneration.create({
      data: {
        conversationId,
        type,
        status: 'PENDING',
        progress: 0,
      }
    });

    // Save user's message
    if (prompt) {
      await prisma.aIMessage.create({
        data: {
          conversationId,
          role: 'USER',
          content: prompt
        }
      });
    }

    // Dispatch to BullMQ which will talk to Python FastAPI
    await aiQueue.add('generateAI', {
      generationId: generation.id,
      conversationId,
      type,
      prompt,
      context
    });

    res.status(202).json({ status: 'success', data: { generation } });
  } catch (error) { next(error); }
};

export const getGenerationJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const generation = await prisma.aIGeneration.findUnique({ where: { id } });
    if (!generation) return next(new AppError('Job not found', 404));

    res.status(200).json({ status: 'success', data: { generation } });
  } catch (error) { next(error); }
};
