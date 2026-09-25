import { Preferences } from '@capacitor/preferences';
import { backupSchema, projectSchema, type Project } from './model';

const KEY = 'designflow.projects.v1';
let writeQueue = Promise.resolve();
export async function readProjects(): Promise<Project[]> {
  const { value } = await Preferences.get({ key: KEY });
  if (!value) return [];
  return backupSchema.parse(JSON.parse(value)).projects;
}
export function writeProjects(projects: Project[]): Promise<void> {
  const value = JSON.stringify(backupSchema.parse({ format: 'designflow-v1', projects }));
  const write = writeQueue.catch(() => {}).then(() => Preferences.set({ key: KEY, value }));
  writeQueue = write;
  return write;
}
export function parseImport(text: string): Project[] {
  try {
    const json: unknown = JSON.parse(text);
    const backup = backupSchema.safeParse(json);
    return backup.success ? backup.data.projects : [projectSchema.parse(json)];
  } catch { throw new Error('This file is not a valid DesignFlow project or backup. Your existing work has not changed.'); }
}
export interface Settings { server: string; email: string; name: string }
export async function readSettings(): Promise<Settings> {
  const { value } = await Preferences.get({ key: 'designflow.settings' });
  try { return { server: '', email: '', name: 'Designer', ...JSON.parse(value || '{}') }; } catch { return { server: '', email: '', name: 'Designer' }; }
}
export async function saveSettings(settings: Settings) { await Preferences.set({ key: 'designflow.settings', value: JSON.stringify(settings) }); }
