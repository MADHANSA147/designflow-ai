import { z } from 'zod';

export const createVersionSchema = z.object({
  body: z.object({
    projectId: z.string().uuid(),
    tag: z.string().min(1),
    description: z.string().optional(),
  })
});

export const restoreVersionSchema = z.object({
  body: z.object({
    projectId: z.string().uuid(),
    versionId: z.string().uuid(),
  })
});
