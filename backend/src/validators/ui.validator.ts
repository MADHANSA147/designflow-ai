import { z } from 'zod';

const COMPONENT_TYPES = [
  'Screen', 'Container', 'Text', 'Heading', 'Image', 'Button', 'Input', 
  'Card', 'List', 'Grid', 'Navigation', 'Tabs', 'Modal', 'Badge', 
  'Avatar', 'Icon', 'Divider', 'Chart', 'Form', 'CustomComponent'
] as const;

// Base schema without children to avoid circular dependency in definition initially
const baseUiNodeSchema = z.object({
  id: z.string().min(1),
  type: z.enum(COMPONENT_TYPES),
  props: z.record(z.any()).optional().default({}),
  styles: z.record(z.any()).optional().default({}),
  constraints: z.record(z.any()).optional().default({}),
  interactions: z.record(z.any()).optional().default({}),
});

// Recursive schema for UI Node Tree
export const uiNodeSchema: z.ZodType<any> = baseUiNodeSchema.extend({
  children: z.lazy(() => z.array(uiNodeSchema)).optional(),
});

// Schema for screen generation request
export const generateScreenSchema = z.object({
  body: z.object({
    projectId: z.string().uuid(),
    screenName: z.string(),
    screenDescription: z.string().optional(),
    context: z.string().optional(), // Specific instructions
  })
});
