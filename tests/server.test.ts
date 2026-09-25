import test from 'node:test';
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { createApp } from '../server/app';
import { newProject, templateDesign } from '../src/app/model';

test('server authentication, project isolation, validation, unavailable AI, and logout', async t => {
  const server = createApp({ database: ':memory:', apiKey: '', origins: ['https://localhost'] });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise<void>(resolve => server.close(() => resolve())));
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/mobile`;
  const call = (path: string, body?: unknown, token?: string) => fetch(base + path, { method: body ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: body ? JSON.stringify(body) : undefined });
  assert.equal((await call('/projects')).status, 401);
  assert.equal((await fetch(base + '/health', { headers: { Origin: 'https://evil.example' } })).status, 403);
  assert.equal((await call('/auth/register', { email: 'bad', password: 'x' })).status, 400);
  const a = await (await call('/auth/register', { email: 'one@example.com', password: 'LongPassword123', name: 'One' })).json();
  const b = await (await call('/auth/register', { email: 'two@example.com', password: 'LongPassword456', name: 'Two' })).json();
  assert.ok(a.token); assert.ok(b.token); assert.equal(a.user.password, undefined);
  const project = newProject('Food delivery app', templateDesign('Food delivery app', '', 'Modern'), 'template');
  assert.equal((await call('/projects', { projects: [project] }, a.token)).status, 200);
  assert.deepEqual((await (await call('/projects', undefined, b.token)).json()).projects, []);
  assert.equal((await (await call('/projects', undefined, a.token)).json()).projects[0].id, project.id);
  assert.equal((await call('/generate', { idea: 'New application' }, a.token)).status, 503);
  assert.equal((await call('/projects', { projects: [{ ...project, id: 'not-a-uuid' }] }, a.token)).status, 400);
  assert.equal((await call('/auth/login', { email: 'one@example.com', password: 'WrongPassword123' })).status, 401);
  assert.equal((await call('/auth/logout', {}, a.token)).status, 200);
  assert.equal((await call('/projects', undefined, a.token)).status, 401);
  const login = await (await call('/auth/login', { email: 'one@example.com', password: 'LongPassword123' })).json();
  assert.equal((await call('/projects', undefined, login.token)).status, 200);
});
test('AI adapter sends structured context, validates output, and handles provider failures', async t => {
  const design = templateDesign('Fitness app', '', 'Modern'); let invalid = false;
  const server = createApp({ database: ':memory:', apiKey: 'test-only', model: 'test-model', fetcher: (async (_url, init) => {
    const request = JSON.parse(String(init?.body)); assert.ok(request.generationConfig.responseJsonSchema); assert.ok(request.systemInstruction);
    return new Response(JSON.stringify({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify(invalid ? { name: 'bad' } : design) }] } }] }), { status: 200 });
  }) as typeof fetch });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise<void>(resolve => server.close(() => resolve())));
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/mobile`;
  const auth = await (await fetch(base + '/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'ai@example.com', password: 'LongPassword123' }) })).json();
  const generate = (body: unknown) => fetch(base + '/generate', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.token }, body: JSON.stringify(body) });
  const good = await generate({ idea: 'Fitness app' }); assert.equal(good.status, 200); assert.deepEqual((await good.json()).design, design);
  invalid = true; assert.equal((await generate({ idea: 'Fitness app' })).status, 502);
  assert.equal((await generate({ idea: 'Fitness app', image: 'data:image/png;base64,YmFk' })).status, 400);
});
