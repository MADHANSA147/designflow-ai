import { z } from 'zod';

export const startExportSchema = z.object({
  body: z.object({
    projectId: z.string().uuid(),
    format: z.enum([
      'PNG', 'JPG', 'PDF', 'PROTOTYPE', 
      'REACT', 'REACT_NATIVE', 'FLUTTER', 'HTML_TAILWIND', 
      'DESIGN_SYSTEM', 'ZIP'
    ]),
    selectedScreens: z.array(z.string().uuid()).default([]),
  })
});
