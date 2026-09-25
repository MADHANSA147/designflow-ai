// User & Workspace
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'admin' | 'designer' | 'developer' | 'viewer';
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  members: User[];
  createdAt: string;
}

// Project & Core Entities
export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  status: 'draft' | 'in_progress' | 'review' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface ProductBrief {
  id: string;
  projectId: string;
  targetAudience: string;
  coreProblem: string;
  keyFeatures: string[];
  toneOfVoice: string;
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  demographics: string;
  painPoints: string[];
  goals: string[];
}

export interface UXPlan {
  id: string;
  projectId: string;
  personas: Persona[];
  userFlows: UserFlow[];
}

export interface UserFlow {
  id: string;
  name: string;
  steps: { id: string; name: string; description: string }[];
}

// Design System & UI
export interface DesignTokens {
  colors: Record<string, string>;
  typography: Record<string, any>;
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
}

export interface DesignSystem {
  id: string;
  projectId: string;
  tokens: DesignTokens;
  assets: Asset[];
}

export interface Asset {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'icon' | 'font';
}

export interface Screen {
  id: string;
  projectId: string;
  name: string;
  content: string; // HTML or JSON representation
  components: UIComponent[];
}

export interface UIComponent {
  id: string;
  screenId: string;
  name: string;
  props: Record<string, any>;
}

// Prototyping
export interface Prototype {
  id: string;
  projectId: string;
  connections: PrototypeConnection[];
}

export interface PrototypeConnection {
  id: string;
  sourceScreenId: string;
  targetScreenId: string;
  trigger: 'click' | 'hover' | 'swipe';
  animation: string;
}

// AI & Review
export interface DesignMemory {
  id: string;
  projectId: string;
  context: string;
  decisions: string[];
}

export interface AIReview {
  id: string;
  screenId: string;
  score: number;
  suggestions: string[];
}

export interface AccessibilityReview {
  id: string;
  screenId: string;
  wcagLevel: 'A' | 'AA' | 'AAA';
  issues: string[];
}

// Development & Export
export interface Version {
  id: string;
  projectId: string;
  versionNumber: string;
  changes: string;
  createdAt: string;
}

export interface GeneratedCode {
  id: string;
  screenId: string;
  framework: string;
  code: string;
}

export interface ExportJob {
  id: string;
  projectId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
}
