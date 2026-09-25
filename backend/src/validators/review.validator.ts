import { z } from 'zod';

export const reviewRequestSchema = z.object({
  body: z.object({
    projectId: z.string().uuid(),
    screenId: z.string().uuid().optional(), // Specific screen, or entire project if omitted
  })
});

export const applyFixSchema = z.object({
  body: z.object({
    projectId: z.string().uuid(),
    findingId: z.string().uuid(),
  })
});
