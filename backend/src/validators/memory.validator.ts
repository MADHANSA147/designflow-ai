import { z } from 'zod';

export const createComponentSchema = z.object({
  body: z.object({
    projectId: z.string().uuid(),
    name: z.string().min(1),
    description: z.string().optional(),
    baseStyles: z.any().optional(),
    variants: z.array(z.object({
      name: z.string(),
      props: z.any(),
    })).optional()
  })
});

export const updateComponentSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    baseStyles: z.any().optional(),
    variants: z.array(z.object({
      id: z.string().uuid().optional(),
      name: z.string(),
      props: z.any(),
    })).optional()
  })
});

export const designMemorySchema = z.object({
  body: z.object({
    projectId: z.string().uuid(),
    brandRules: z.array(z.string()).optional(),
    colors: z.array(z.string()).optional(),
    typography: z.array(z.string()).optional(),
    spacing: z.array(z.string()).optional(),
    componentRules: z.array(z.string()).optional(),
    navigationRules: z.array(z.string()).optional(),
    uxPrinciples: z.array(z.string()).optional(),
    userPreferences: z.array(z.string()).optional(),
    aiDecisions: z.array(z.string()).optional(),
    projectConstraints: z.array(z.string()).optional(),
  })
});
