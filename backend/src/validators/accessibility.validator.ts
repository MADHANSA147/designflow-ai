import { z } from 'zod';

export const accessibilityRequestSchema = z.object({
  body: z.object({
    projectId: z.string().uuid(),
    screenId: z.string().uuid().optional(),
    wcagLevel: z.enum(['A', 'AA', 'AAA']).default('AA'),
  })
});

export const applyAccessibilityFixSchema = z.object({
  body: z.object({
    projectId: z.string().uuid(),
    findingId: z.string().uuid(),
  })
});

export const applyAllFixesSchema = z.object({
  body: z.object({
    projectId: z.string().uuid(),
    reviewId: z.string().uuid(),
  })
});
