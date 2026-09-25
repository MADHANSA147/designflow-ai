import { z } from 'zod';

export const copilotRequestSchema = z.object({
  body: z.object({
    projectId: z.string().uuid(),
    screenId: z.string().uuid().optional(),
    selectedComponentId: z.string().optional(),
    prompt: z.string().min(1),
  })
});

// A patch structure to avoid rewriting the whole UI
export const uiPatchSchema = z.object({
  action: z.enum(['UPDATE', 'INSERT', 'DELETE', 'REPLACE']),
  nodeId: z.string().optional(), // The target node
  parentId: z.string().optional(), // Where to insert if action is INSERT
  payload: z.any().optional(), // The actual component JSON or props to update
  reasoning: z.string().optional(), // Explain why AI made this change
});

export const copilotResponseSchema = z.object({
  intent: z.string(),
  reasoning: z.string(),
  patches: z.array(uiPatchSchema),
});

export const applyPatchSchema = z.object({
  body: z.object({
    projectId: z.string().uuid(),
    screenId: z.string().uuid(),
    generationId: z.string().uuid(), // The ID of the AIGeneration record
  })
});
