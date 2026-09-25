import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    idea: z.string().min(1, 'Product idea is required'),
    platform: z.string().optional(),
    targetAudience: z.string().optional(),
    designStyle: z.string().optional(),
    referenceInfo: z.string().optional(),
    workspaceId: z.string().uuid(),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    status: z.string().optional(),
  }),
});

export const favoriteProjectSchema = z.object({
  body: z.object({
    isFavorite: z.boolean(),
  }),
});
