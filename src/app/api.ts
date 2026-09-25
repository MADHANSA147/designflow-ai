import { designSchema, projectSchema, type Design, type Project } from './model';
let base = '';
let token = ''; // Session credentials intentionally stay in memory, not exported or saved in preferences.
export function configureServer(url: string) {
  if (url) {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && !(parsed.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(parsed.hostname))) throw new Error('Use an HTTPS server URL. HTTP is allowed only on localhost for development.');
    if (parsed.username || parsed.password || parsed.search || parsed.hash) throw new Error('Enter a plain server URL without credentials, query, or fragment.');
  }
  base = url.replace(/\/$/, ''); token = '';
}
async function request(path: string, body?: unknown, method?: string) {
  if (!base) throw new Error('Add your server URL in Settings first.');
  const response = await fetch(base + '/api/mobile' + path, {
    method: method || (body ? 'POST' : 'GET'), headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(90000),
  });
  const json = await response.json().catch(() => ({ error: 'The server did not return JSON.' }));
  if (!response.ok) throw new Error(json.error || 'Server request failed.');
  return json;
}
export const api = {
  connected: () => Boolean(token),
  health: () => request('/health'),
  async auth(mode: 'login' | 'register', email: string, password: string, name: string) {
    const data = await request('/auth/' + mode, { email, password, name }); token = data.token; return data.user;
  },
  async logout() { try { if (token) await request('/auth/logout', {}); } finally { token = ''; } },
  async generate(idea: string, audience: string, style: string, image?: string) { return designSchema.parse((await request('/generate', { idea, audience, style, image })).design); },
  async refine(design: Design, instruction: string) { return designSchema.parse((await request('/refine', { design, instruction })).design); },
  async push(projects: Project[]) { await request('/projects', { projects }); },
  async pull(): Promise<Project[]> { const data = await request('/projects'); return projectSchema.array().parse(data.projects); },
};
