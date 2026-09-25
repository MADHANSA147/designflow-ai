import { Project, User, ProductBrief, UXPlan, DesignSystem, Screen, UIComponent, AIReview, Prototype, GeneratedCode, ExportJob } from '../types';

export const authService = {
  login: async (email: string, password?: string): Promise<User> => {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: password || 'default' }),
    });
    if (!response.ok) throw new Error('Login failed');
    const data = await response.json();
    return data.data.user;
  },
  logout: async (): Promise<void> => {
    await fetch('/api/v1/auth/logout', { method: 'POST' });
  },
  getMe: async (): Promise<User> => {
    const response = await fetch('/api/v1/auth/me', { method: 'GET' });
    if (!response.ok) throw new Error('Not authenticated');
    const data = await response.json();
    return data.data.user;
  }
};

export const projectService = {
  getProjects: async (workspaceId?: string, search?: string, filter?: string): Promise<Project[]> => {
    const query = new URLSearchParams();
    if (workspaceId) query.append('workspaceId', workspaceId);
    if (search) query.append('search', search);
    if (filter) query.append('filter', filter);
    
    const response = await fetch(`/api/v1/projects?${query.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    const data = await response.json();
    return data.data.projects;
  },
  createProject: async (idea: string, workspaceId: string, platform?: string, targetAudience?: string, designStyle?: string, referenceInfo?: string): Promise<Project> => {
    const response = await fetch('/api/v1/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea, workspaceId, platform, targetAudience, designStyle, referenceInfo }),
    });
    if (!response.ok) throw new Error('Failed to create project');
    const data = await response.json();
    return data.data.project;
  }
};

export const productService = {
  getBrief: async (projectId: string): Promise<ProductBrief | null> => {
    // Optional implementation
    return null;
  },
  generateBrief: async (projectId: string, idea: string, targetUsers?: string, platform?: string, businessGoals?: string): Promise<ProductBrief> => {
    const response = await fetch('/api/v1/ai/generate-brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, idea, targetUsers, platform, businessGoals }),
    });
    if (!response.ok) throw new Error('Failed to generate product brief');
    const data = await response.json();
    return data.data.productBrief;
  }
};

export const uxService = {
  getPlan: async (projectId: string): Promise<UXPlan | null> => null,
  generatePlan: async (projectId: string, productBriefId: string): Promise<UXPlan> => {
    const response = await fetch('/api/v1/ai/generate-ux-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, productBriefId }),
    });
    if (!response.ok) throw new Error('Failed to generate UX plan');
    const data = await response.json();
    return data.data.uxPlan;
  }
};

export const designSystemService = {
  getSystem: async (projectId: string): Promise<DesignSystem | null> => {
    // Optional implementation
    return null;
  },
  generateSystem: async (projectId: string, brandPreferences?: string, designStyle?: string): Promise<{ designSystem: DesignSystem, components: UIComponent[] }> => {
    const response = await fetch('/api/v1/ai/generate-design-system', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, brandPreferences, designStyle }),
    });
    if (!response.ok) throw new Error('Failed to generate design system');
    const data = await response.json();
    return data.data; // returns { designSystem, components }
  },
  updateSystem: async (system: DesignSystem): Promise<DesignSystem> => {
    return system;
  }
};

export const screenService = {
  getScreens: async (projectId: string): Promise<Screen[]> => [],
  saveScreen: async (screen: Screen): Promise<void> => {},
  generateScreen: async (projectId: string, screenName: string, context?: string): Promise<Screen> => {
    const response = await fetch('/api/v1/ai/generate-screen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, screenName, context }),
    });
    if (!response.ok) throw new Error('Failed to generate screen');
    const data = await response.json();
    return data.data.screen;
  }
};

export const componentService = {
  getComponents: async (projectId: string): Promise<any[]> => {
    const response = await fetch(`/api/v1/memory/components?projectId=${projectId}`);
    if (!response.ok) throw new Error('Failed to fetch components');
    const data = await response.json();
    return data.data.components;
  },
  createComponent: async (projectId: string, componentData: any): Promise<any> => {
    const response = await fetch('/api/v1/memory/components', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, ...componentData }),
    });
    if (!response.ok) throw new Error('Failed to create component');
    const data = await response.json();
    return data.data.component;
  }
};

export const aiService = {
  startGeneration: async (conversationId: string, type: string, prompt: string, context?: any): Promise<any> => {
    const response = await fetch('/api/v1/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId, type, prompt, context })
    });
    if (!response.ok) throw new Error('Failed to start AI generation');
    const data = await response.json();
    return data.data.generation; // Returns the job tracking object
  },
  getGenerationJob: async (jobId: string): Promise<any> => {
    const response = await fetch(`/api/v1/ai/jobs/${jobId}`);
    if (!response.ok) throw new Error('Failed to fetch AI job status');
    const data = await response.json();
    return data.data.generation;
  },
  generateSuggestions: async (context: string): Promise<string[]> => ['Use more contrast', 'Simplify navigation'],
  askCopilot: async (projectId: string, prompt: string, screenId?: string, selectedComponentId?: string): Promise<any> => {
    const response = await fetch('/api/v1/copilot/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, screenId, selectedComponentId, prompt }),
    });
    if (!response.ok) throw new Error('Copilot request failed');
    const data = await response.json();
    return data.data; // { generationId, intent, reasoning, patches }
  },
  applyCopilotPatch: async (projectId: string, screenId: string, generationId: string): Promise<void> => {
    const response = await fetch('/api/v1/copilot/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, screenId, generationId }),
    });
    if (!response.ok) throw new Error('Failed to apply patch');
  }
};

export const visionService = {
  analyzeScreenshot: async (projectId: string, imageUrl: string, type: 'SCREENSHOT' | 'SKETCH' = 'SCREENSHOT'): Promise<any> => {
    const response = await fetch('/api/v1/vision/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, imageUrl, type }),
    });
    if (!response.ok) throw new Error('Vision analysis failed');
    const data = await response.json();
    return data.data; // { generationId, analysisResult, uiSchema, assetUrl }
  },
  applyVisionScreen: async (projectId: string, generationId: string, screenName: string): Promise<any> => {
    const response = await fetch('/api/v1/vision/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, generationId, screenName }),
    });
    if (!response.ok) throw new Error('Failed to apply vision screen');
    const data = await response.json();
    return data.data.screen;
  }
};

export const reviewService = {
  getReviews: async (projectId: string): Promise<any[]> => {
    const response = await fetch(`/api/v1/review?projectId=${projectId}`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    const data = await response.json();
    return data.data.reviews;
  },
  runReview: async (projectId: string, screenId?: string): Promise<any> => {
    const response = await fetch('/api/v1/review/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, screenId }),
    });
    if (!response.ok) throw new Error('Failed to run review');
    const data = await response.json();
    return data.data.review;
  },
  applyFix: async (projectId: string, findingId: string): Promise<void> => {
    const response = await fetch('/api/v1/review/apply-fix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, findingId }),
    });
    if (!response.ok) throw new Error('Failed to apply fix');
  }
};

export const prototypeService = {
  getPrototype: async (projectId: string): Promise<any> => {
    const response = await fetch(`/api/v1/prototype?projectId=${projectId}`);
    if (!response.ok) return null; // Or throw depending on preference, but null is safer if empty
    const data = await response.json();
    return data.data.prototype;
  },
  createConnection: async (connectionData: any): Promise<any> => {
    const response = await fetch('/api/v1/prototype/connections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(connectionData),
    });
    if (!response.ok) throw new Error('Failed to create connection');
    const data = await response.json();
    return data.data.connection;
  },
  updateConnection: async (connectionId: string, updates: any): Promise<any> => {
    const response = await fetch(`/api/v1/prototype/connections/${connectionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update connection');
    const data = await response.json();
    return data.data.connection;
  },
  deleteConnection: async (connectionId: string): Promise<void> => {
    const response = await fetch(`/api/v1/prototype/connections/${connectionId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete connection');
  },
  previewPrototype: async (projectId: string): Promise<any> => {
    const response = await fetch(`/api/v1/prototype/${projectId}/preview`);
    if (!response.ok) throw new Error('Failed to fetch preview');
    const data = await response.json();
    return data.data; // { prototype, screens }
  }
};

export const codeService = {
  generateCode: async (screenId: string, framework: string): Promise<GeneratedCode> => ({
    id: 'c1', screenId, framework, code: '<div>Mock Code</div>'
  })
};

export const accessibilityService = {
  getReviews: async (projectId: string): Promise<any[]> => {
    const response = await fetch(`/api/v1/accessibility?projectId=${projectId}`);
    if (!response.ok) throw new Error('Failed to fetch accessibility reviews');
    const data = await response.json();
    return data.data.reviews;
  },
  runAnalysis: async (projectId: string, screenId?: string, wcagLevel: string = 'AA'): Promise<any> => {
    const response = await fetch('/api/v1/accessibility/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, screenId, wcagLevel }),
    });
    if (!response.ok) throw new Error('Failed to run accessibility review');
    const data = await response.json();
    return data.data.review;
  },
  applyFix: async (projectId: string, findingId: string): Promise<void> => {
    const response = await fetch('/api/v1/accessibility/apply-fix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, findingId }),
    });
    if (!response.ok) throw new Error('Failed to apply accessibility fix');
  },
  applyAllFixes: async (projectId: string, reviewId: string): Promise<void> => {
    const response = await fetch('/api/v1/accessibility/apply-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, reviewId }),
    });
    if (!response.ok) throw new Error('Failed to apply all accessibility fixes');
  }
};

export const versionService = {
  getVersions: async (projectId: string): Promise<any[]> => {
    const response = await fetch(`/api/v1/versions?projectId=${projectId}`);
    if (!response.ok) throw new Error('Failed to fetch versions');
    const data = await response.json();
    return data.data.versions;
  },
  createVersion: async (projectId: string, tag: string, description?: string): Promise<void> => {
    const response = await fetch('/api/v1/versions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, tag, description }),
    });
    if (!response.ok) throw new Error('Failed to create version');
  },
  getVersion: async (versionId: string): Promise<any> => {
    const response = await fetch(`/api/v1/versions/${versionId}`);
    if (!response.ok) throw new Error('Failed to fetch version details');
    const data = await response.json();
    return data.data.version;
  },
  restoreVersion: async (projectId: string, versionId: string): Promise<void> => {
    const response = await fetch('/api/v1/versions/restore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, versionId }),
    });
    if (!response.ok) throw new Error('Failed to restore version');
  }
};

export const previewService = {
  getPreviewData: async (projectId: string, screenId: string): Promise<any> => {
    const response = await fetch(`/api/v1/preview/data?projectId=${projectId}&screenId=${screenId}`);
    if (!response.ok) throw new Error('Failed to fetch preview data');
    const data = await response.json();
    return data.data; // { designSystem, components, screen }
  },
  getSandboxedPreview: async (projectId: string, screenId: string): Promise<any> => {
    const response = await fetch('/api/v1/preview/sandbox', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, screenId }),
    });
    if (!response.ok) {
      // For MVP this will throw the 501 Not Implemented error gracefully
      const errorData = await response.json();
      throw new Error(errorData.message || 'Sandbox failed');
    }
    const data = await response.json();
    return data.data;
  }
};

export const exportService = {
  startExport: async (projectId: string, format: string, selectedScreens: string[] = []): Promise<any> => {
    const response = await fetch('/api/v1/export/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, format, selectedScreens }),
    });
    if (!response.ok) throw new Error('Failed to start export');
    const data = await response.json();
    return data.data.job;
  },
  getExportJob: async (jobId: string): Promise<any> => {
    const response = await fetch(`/api/v1/export/${jobId}`);
    if (!response.ok) throw new Error('Failed to fetch export job');
    const data = await response.json();
    return data.data.job;
  },
  listExportJobs: async (projectId: string): Promise<any[]> => {
    const response = await fetch(`/api/v1/export?projectId=${projectId}`);
    if (!response.ok) throw new Error('Failed to fetch export jobs');
    const data = await response.json();
    return data.data.jobs;
  }
};

export const assetService = {
  uploadAsset: async (file: File, type: string, projectId?: string): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    if (projectId) formData.append('projectId', projectId);

    const response = await fetch('/api/v1/assets/upload', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload asset');
    const data = await response.json();
    return data.data.asset;
  },
  getAssetUrl: async (assetId: string, expiresIn?: number): Promise<string> => {
    let url = `/api/v1/assets/${assetId}/url`;
    if (expiresIn) url += `?expiresIn=${expiresIn}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch asset URL');
    const data = await response.json();
    return data.data.url;
  },
  deleteAsset: async (assetId: string): Promise<void> => {
    const response = await fetch(`/api/v1/assets/${assetId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete asset');
  }
};
