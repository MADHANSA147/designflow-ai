import { z } from 'zod';

export const analyzeImageSchema = z.object({
  body: z.object({
    projectId: z.string().uuid(),
    imageUrl: z.string().url().or(z.string().min(1)), // Can be data URI for mock or actual URL
    type: z.enum(['SCREENSHOT', 'SKETCH']),
    context: z.string().optional(),
  })
});

export const applyVisionScreenSchema = z.object({
  body: z.object({
    projectId: z.string().uuid(),
    generationId: z.string().uuid(),
    screenName: z.string().min(1),
  })
});
