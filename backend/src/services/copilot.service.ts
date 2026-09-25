import { copilotResponseSchema } from '../validators/copilot.validator';
import { z } from 'zod';

export const copilotService = {
  async processRequest(
    prompt: string,
    context: any
  ): Promise<z.infer<typeof copilotResponseSchema>> {
    
    // MOCK AI CLASSIFICATION & REASONING
    let intent = 'UPDATE_UI';
    let reasoning = 'I will update the selected component based on your request.';
    let patches = [];

    const lowerPrompt = prompt.toLowerCase();

    if (lowerPrompt.includes('premium')) {
      reasoning = 'Adding subtle shadows, increasing padding, and using a richer surface color to make it feel more premium.';
      patches.push({
        action: 'UPDATE' as const,
        nodeId: context.selectedComponentId || 'root',
        payload: {
          styles: {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            padding: 'xl',
            backgroundColor: 'surface-premium'
          }
        },
        reasoning: 'Applied premium shadow and spacing.'
      });
    } else if (lowerPrompt.includes('cta') || lowerPrompt.includes('prominence')) {
      reasoning = 'Increasing the contrast and size of the primary call-to-action button.';
      patches.push({
        action: 'UPDATE' as const,
        nodeId: context.selectedComponentId || 'btn-1',
        payload: {
          props: { variant: 'primary', size: 'large' },
          styles: { transform: 'scale(1.05)' }
        },
        reasoning: 'Made CTA larger and more contrasting.'
      });
    } else if (lowerPrompt.includes('navigation') || lowerPrompt.includes('bottom')) {
      reasoning = 'Inserting a bottom navigation bar at the root of the screen.';
      patches.push({
        action: 'INSERT' as const,
        parentId: 'root',
        payload: {
          id: 'bottom-nav-1',
          type: 'Navigation',
          props: { position: 'bottom', items: ['Home', 'Search', 'Profile'] },
          styles: { position: 'fixed', bottom: 0, width: '100%' }
        },
        reasoning: 'Added bottom tab navigation.'
      });
    } else {
      reasoning = 'Adjusting layout based on general request.';
      patches.push({
        action: 'UPDATE' as const,
        nodeId: context.selectedComponentId || 'root',
        payload: {
          styles: { opacity: '0.9' }
        },
        reasoning: 'Applied generic style adjustment.'
      });
    }

    const output = {
      intent,
      reasoning,
      patches,
    };

    return copilotResponseSchema.parse(output);
  }
};
