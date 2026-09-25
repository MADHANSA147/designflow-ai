import { z } from 'zod';

// Zod schemas for AI structured outputs
export const productBriefOutputSchema = z.object({
  productType: z.string(),
  targetAudience: z.string(),
  coreProblem: z.string(),
  solution: z.string(),
  businessGoals: z.array(z.string()),
  userGoals: z.array(z.string()),
  requirements: z.array(z.string()),
  constraints: z.array(z.string()),
  assumptions: z.array(z.string()),
  features: z.array(z.object({
    name: z.string(),
    description: z.string(),
    priority: z.enum(['MUST_HAVE', 'SHOULD_HAVE', 'COULD_HAVE']),
  })),
  personas: z.array(z.object({
    name: z.string(),
    role: z.string(),
    demographics: z.string(),
    painPoints: z.array(z.string()),
    goals: z.array(z.string()),
  }))
});

export const uxPlanOutputSchema = z.object({
  informationArchitecture: z.any(), // JSON
  userJourney: z.any(), // JSON
  userFlows: z.array(z.object({
    name: z.string(),
    description: z.string(),
    nodes: z.array(z.object({
      id: z.string(),
      name: z.string(),
      nodeType: z.string(),
    })),
    edges: z.array(z.object({
      sourceId: z.string(),
      targetId: z.string(),
      label: z.string().optional(),
    }))
  }))
});

export const designSystemOutputSchema = z.object({
  colors: z.array(z.object({
    name: z.string(),
    value: z.string(),
    theme: z.string(),
  })),
  typography: z.array(z.object({
    name: z.string(),
    fontFamily: z.string(),
    fontSize: z.string(),
    fontWeight: z.string(),
    lineHeight: z.string(),
    letterSpacing: z.string().optional(),
  })),
  spacing: z.array(z.object({
    name: z.string(),
    value: z.string(),
  })),
  radius: z.array(z.string()),
  shadows: z.array(z.string()),
  components: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    baseStyles: z.any(),
    variants: z.array(z.object({
      name: z.string(),
      props: z.any(),
    }))
  }))
});

// Validators for incoming API requests
export const generateProductBriefSchema = z.object({
  body: z.object({
    projectId: z.string().uuid(),
    idea: z.string(),
    targetUsers: z.string().optional(),
    platform: z.string().optional(),
    businessGoals: z.string().optional(),
  })
});

export const generateUXPlanSchema = z.object({
  body: z.object({
    projectId: z.string().uuid(),
    productBriefId: z.string().uuid(),
  })
});

export const generateDesignSystemSchema = z.object({
  body: z.object({
    projectId: z.string().uuid(),
    brandPreferences: z.string().optional(),
    designStyle: z.string().optional(),
  })
});
