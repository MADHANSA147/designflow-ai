export const reviewService = {
  async conductReview(context: any): Promise<any> {
    // MOCK: In production, the LLM parses the componentTree alongside UX heuristsics
    
    return {
      score: 78.5,
      findings: [
        {
          type: 'WARNING',
          category: 'Visual Hierarchy',
          screenId: context.screenId || null,
          elementId: 'btn-submit',
          problem: 'Primary Call-To-Action (CTA) blends into the background.',
          explanation: 'The background color of the submit button is too similar to the surrounding surface, reducing its discoverability and violating standard CTA hierarchy rules.',
          recommendation: 'Increase the contrast by using the primary brand color for the CTA background.',
          suggestedFix: JSON.stringify({
            action: 'UPDATE',
            nodeId: 'btn-submit',
            payload: {
              styles: { backgroundColor: 'primary', color: 'white' }
            }
          }),
          confidence: 0.95
        },
        {
          type: 'ERROR',
          category: 'Usability',
          screenId: context.screenId || null,
          elementId: 'input-email',
          problem: 'Form input lacks visual feedback for active/focus states.',
          explanation: 'Users cannot easily determine if the input is active, increasing cognitive load and potential for error.',
          recommendation: 'Add a distinct focus ring or border highlight.',
          suggestedFix: JSON.stringify({
            action: 'UPDATE',
            nodeId: 'input-email',
            payload: {
              styles: { ':focus': { outline: '2px solid primary' } }
            }
          }),
          confidence: 0.88
        }
      ]
    };
  }
};
