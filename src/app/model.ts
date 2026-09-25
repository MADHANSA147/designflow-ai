import { z } from 'zod';

export const nodeSchema = z.object({
  id: z.string().min(1).max(80),
  type: z.enum(['heading', 'text', 'card', 'button', 'input', 'image', 'navigation']),
  text: z.string().max(1000),
  detail: z.string().max(2000).default(''),
  target: z.string().max(80).default(''),
});
export const screenSchema = z.object({ id: z.string().min(1).max(80), name: z.string().min(1).max(80), nodes: z.array(nodeSchema).min(1).max(40) });
export const themeSchema = z.object({
  primary: z.string().regex(/^#[0-9a-f]{6}$/i), background: z.string().regex(/^#[0-9a-f]{6}$/i),
  surface: z.string().regex(/^#[0-9a-f]{6}$/i), text: z.string().regex(/^#[0-9a-f]{6}$/i),
  radius: z.number().int().min(0).max(32), spacing: z.number().int().min(8).max(32), fontSize: z.number().int().min(12).max(24),
});
export const designSchema = z.object({
  name: z.string().min(1).max(80), brief: z.string().min(1).max(4000), audience: z.string().max(400),
  features: z.array(z.string().max(200)).min(1).max(20), theme: themeSchema,
  screens: z.array(screenSchema).min(1).max(15), decisions: z.array(z.string().max(500)).max(30),
}).superRefine((design, ctx) => {
  const screens = new Set(design.screens.map(s => s.id));
  if (screens.size !== design.screens.length) ctx.addIssue({ code: 'custom', message: 'Screen IDs must be unique' });
  for (const screen of design.screens) {
    if (new Set(screen.nodes.map(n => n.id)).size !== screen.nodes.length) ctx.addIssue({ code: 'custom', message: 'Element IDs must be unique within a screen' });
    for (const node of screen.nodes) if (node.target && !screens.has(node.target)) ctx.addIssue({ code: 'custom', message: 'Navigation destination does not exist' });
  }
});
export type Design = z.infer<typeof designSchema>;
export type DesignNode = z.infer<typeof nodeSchema>;
export type DesignScreen = z.infer<typeof screenSchema>;
export const projectSchema = z.object({
  id: z.string().uuid(), idea: z.string().min(3).max(6000), createdAt: z.string().datetime(), updatedAt: z.string().datetime(),
  favorite: z.boolean(), source: z.enum(['template', 'ai', 'import']), design: designSchema,
  history: z.array(z.object({ id: z.string().uuid(), label: z.string().max(150), at: z.string().datetime(), design: designSchema })).max(20),
  messages: z.array(z.object({ role: z.enum(['user', 'assistant']), text: z.string().max(6000) })).max(50),
});
export type Project = z.infer<typeof projectSchema>;
export const backupSchema = z.object({ format: z.literal('designflow-v1'), projects: z.array(projectSchema).max(100) });

export function checkpoint(project: Project, label: string): Project {
  return { ...structuredClone(project), updatedAt: new Date().toISOString(), history: [{ id: crypto.randomUUID(), label, at: new Date().toISOString(), design: structuredClone(project.design) }, ...project.history].slice(0, 20) };
}

export function newProject(idea: string, design: Design, source: Project['source']): Project {
  return projectSchema.parse({ id: crypto.randomUUID(), idea, design, source, favorite: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), history: [], messages: [] });
}

const palettes = {
  violet: { primary: '#6d28d9', background: '#f6f4fc', surface: '#ffffff', text: '#201933' },
  ocean: { primary: '#075985', background: '#f0f9ff', surface: '#ffffff', text: '#102b3d' },
  forest: { primary: '#166534', background: '#f0fdf4', surface: '#ffffff', text: '#163326' },
  dark: { primary: '#a78bfa', background: '#15131c', surface: '#24202e', text: '#f5f3ff' },
};
export type Palette = keyof typeof palettes;
export function applyPalette(design: Design, palette: Palette) { design.theme = { ...design.theme, ...palettes[palette] }; }

export function templateDesign(idea: string, audience: string, style: string): Design {
  const food = /food|restaurant|meal|eat|delivery/i.test(idea);
  const fitness = /fitness|workout|health|gym|run/i.test(idea);
  const shop = /shop|store|commerce|fashion/i.test(idea);
  const name = food ? 'CampusEats' : fitness ? 'Forma' : shop ? 'Curate' : 'New perspective';
  const items = food ? ['Fresh bowls', 'Everyday favourites', 'Quick bites'] : fitness ? ['Morning movement', 'Strength foundations', 'Evening reset'] : shop ? ['The essentials', 'Made for everyday', 'New discoveries'] : ['Your first collection', 'Recommended for you', 'Explore something new'];
  const action = food ? 'Place order' : fitness ? 'Start session' : shop ? 'Complete order' : 'Get started';
  const node = (id: string, type: DesignNode['type'], text: string, detail = '', target = '') => ({ id, type, text, detail, target });
  const design: Design = {
    name, brief: idea.slice(0, 4000), audience: audience || 'People who want a simpler mobile experience',
    features: ['Discover and search', 'Explore details', action, 'Manage your profile'],
    theme: { ...palettes.violet, radius: style === 'Minimal' ? 8 : 20, spacing: 16, fontSize: 16 },
    decisions: ['A shared theme keeps every screen consistent.', 'One primary action per screen.', 'This starting point was assembled from local templates; it is not AI-generated.'],
    screens: [
      { id: 'home', name: 'Discover', nodes: [node('h', 'heading', food ? 'Good food. Good mood.' : fitness ? 'Make space for you.' : 'Find your next favourite.'), node('sub', 'text', food ? 'Fresh picks, right around the corner.' : 'A little inspiration for your everyday.'), node('search', 'input', 'Search', 'What are you looking for?'), ...items.map((text, i) => node('card' + i, 'card', text, food ? 'Freshly prepared · 20–30 min' : fitness ? '20 minutes · All levels' : 'Thoughtfully selected for you', 'detail')), node('profile', 'navigation', 'Your profile', '', 'profile')] },
      { id: 'detail', name: 'Details', nodes: [node('hero', 'image', items[0], 'Visual placeholder'), node('title', 'heading', items[0]), node('body', 'text', food ? 'Made with seasonal ingredients and a little extra care.' : 'Everything you need to make a confident choice.'), node('info', 'card', 'The details', food ? 'Customise your order before checking out.' : 'Designed around your needs, at your pace.'), node('cta', 'button', food || shop ? 'Continue to checkout' : 'Continue', '', 'checkout'), node('back', 'navigation', 'Back to discover', '', 'home')] },
      { id: 'checkout', name: food || shop ? 'Checkout' : 'Get started', nodes: [node('title', 'heading', 'Make it yours'), node('summary', 'card', items[0], 'Review your selection'), node('name', 'input', 'Your name', 'Enter your name'), node('notes', 'input', 'Notes', 'Anything we should know?'), node('cta', 'button', action, '', 'success'), node('back', 'navigation', 'Back to details', '', 'detail')] },
      { id: 'success', name: 'Success', nodes: [node('title', 'heading', 'You’re all set.'), node('body', 'text', 'Your next step starts here. Thanks for being part of it.'), node('cta', 'button', 'Back to discover', '', 'home')] },
      { id: 'profile', name: 'Profile', nodes: [node('title', 'heading', 'Your space'), node('name', 'input', 'Display name', 'How should we call you?'), node('email', 'input', 'Email address', 'you@example.com'), node('info', 'text', 'This is an interactive design prototype. Form entries are preview-only.'), node('cta', 'button', 'Back to discover', '', 'home')] },
    ],
  };
  if (style === 'Dark') applyPalette(design, 'dark');
  return designSchema.parse(design);
}

export function contrast(a: string, b: string): number {
  const luminance = (hex: string) => {
    const rgb = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  };
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
export const buttonInk = (primary: string) => contrast(primary, '#ffffff') >= contrast(primary, '#111111') ? '#ffffff' : '#111111';
export function review(design: Design) {
  const findings: { title: string; detail: string; pass: boolean }[] = [
    { title: 'Text contrast', detail: `${contrast(design.theme.text, design.theme.background).toFixed(2)}:1 on background; aim for 4.5:1 for body text.`, pass: contrast(design.theme.text, design.theme.background) >= 4.5 },
    { title: 'Card contrast', detail: `${contrast(design.theme.text, design.theme.surface).toFixed(2)}:1 on surfaces.`, pass: contrast(design.theme.text, design.theme.surface) >= 4.5 },
    { title: 'Body size', detail: `${design.theme.fontSize}px body text; 16px is the app’s readability guideline.`, pass: design.theme.fontSize >= 16 },
  ];
  for (const screen of design.screens) {
    findings.push({ title: `${screen.name}: heading`, detail: 'One main heading helps establish a clear hierarchy.', pass: screen.nodes.filter(n => n.type === 'heading').length === 1 });
    findings.push({ title: `${screen.name}: navigation`, detail: 'At least one action should lead to another screen.', pass: screen.nodes.some(n => n.target && n.target !== screen.id) });
    findings.push({ title: `${screen.name}: labels`, detail: 'Inputs and actions need meaningful labels.', pass: screen.nodes.every(n => !['input', 'button', 'navigation'].includes(n.type) || n.text.trim().length > 0) });
  }
  return findings;
}

export function localRefine(design: Design, instruction: string): string {
  const text = instruction.toLowerCase();
  if (/dark/.test(text)) { applyPalette(design, 'dark'); return 'Applied the dark palette to every screen.'; }
  if (/blue|ocean/.test(text)) { applyPalette(design, 'ocean'); return 'Applied the ocean palette to every screen.'; }
  if (/green|forest/.test(text)) { applyPalette(design, 'forest'); return 'Applied the forest palette to every screen.'; }
  if (/light|purple|violet/.test(text)) { applyPalette(design, 'violet'); return 'Applied the violet palette to every screen.'; }
  if (/spac/.test(text)) { design.theme.spacing = Math.min(32, design.theme.spacing + 4); return 'Increased shared spacing by 4px, up to 32px.'; }
  if (/minimal/.test(text)) { design.theme.radius = 8; design.theme.spacing = 20; return 'Applied compact corners and more whitespace.'; }
  if (/round|premium/.test(text)) { design.theme.radius = 24; design.theme.spacing = 24; return 'Applied softer corners and generous spacing.'; }
  if (/accessib|contrast|readab/.test(text)) {
    design.theme.fontSize = Math.max(16, design.theme.fontSize);
    const dark = contrast('#ffffff', design.theme.background) > contrast('#111111', design.theme.background);
    design.theme.text = dark ? '#ffffff' : '#111111'; design.theme.surface = dark ? '#24202e' : '#ffffff';
    return 'Improved text contrast and body size. Run design checks to inspect the result.';
  }
  throw new Error('Local commands support dark, light, blue, green, spacing, minimal, rounded, and accessibility. Connect an AI server for open-ended edits.');
}
