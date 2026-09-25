import { z } from 'zod';

export const createPrototypeSchema = z.object({
  body: z.object({
    projectId: z.string().uuid(),
  })
});

export const connectionSchema = z.object({
  body: z.object({
    projectId: z.string().uuid(),
    prototypeId: z.string().uuid(),
    sourceScreenId: z.string().uuid(),
    targetScreenId: z.string().uuid().optional().nullable(),
    trigger: z.enum(['TAP', 'CLICK', 'SWIPE', 'HOVER', 'DELAY']),
    triggerNodeId: z.string().optional(),
    actionType: z.enum(['NAVIGATE', 'BACK', 'MODAL', 'OVERLAY', 'EXTERNAL_LINK']),
    actionData: z.string().optional(),
    animation: z.enum(['INSTANT', 'FADE', 'SLIDE_IN']).optional(),
  })
});

export const updateConnectionSchema = z.object({
  body: z.object({
    targetScreenId: z.string().uuid().optional().nullable(),
    trigger: z.enum(['TAP', 'CLICK', 'SWIPE', 'HOVER', 'DELAY']).optional(),
    triggerNodeId: z.string().optional(),
    actionType: z.enum(['NAVIGATE', 'BACK', 'MODAL', 'OVERLAY', 'EXTERNAL_LINK']).optional(),
    actionData: z.string().optional(),
    animation: z.enum(['INSTANT', 'FADE', 'SLIDE_IN']).optional(),
  })
});
