import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import { applyPalette, checkpoint, contrast, designSchema, localRefine, newProject, review, templateDesign } from '../src/app/model';
import { escapeHtml, htmlExport, reactNativeExport } from '../src/app/export';
import { parseImport } from '../src/app/storage';

test('templates generate valid linked screens in every style and domain', () => {
  for (const idea of ['Food delivery for students', 'Fitness coaching', 'Fashion shop', 'Creative community']) {
    for (const style of ['Modern', 'Minimal', 'Dark']) {
      const design = templateDesign(idea, 'Students', style);
      assert.equal(designSchema.safeParse(design).success, true);
      assert.equal(design.screens.length, 5);
      assert.ok(review(design).every(f => f.pass));
    }
  }
});
test('untrusted designs reject broken navigation, duplicate IDs, and CSS injection', () => {
  const d = templateDesign('An app', '', 'Modern');
  d.screens[0].nodes[0].target = 'missing'; assert.equal(designSchema.safeParse(d).success, false);
  d.screens[0].nodes[0].target = ''; d.screens[1].id = d.screens[0].id; assert.equal(designSchema.safeParse(d).success, false);
  const clean = templateDesign('An app', '', 'Modern'); clean.theme.primary = 'red;display:none'; assert.equal(designSchema.safeParse(clean).success, false);
});
test('history snapshots are independent and capped at twenty', () => {
  let p = newProject('Fitness app', templateDesign('Fitness app', '', 'Modern'), 'template');
  for (let i = 0; i < 25; i++) { p = checkpoint(p, 'edit'); p.design.name = String(i); }
  assert.equal(p.history.length, 20); assert.equal(p.history[0].design.name, '23');
  p.design.screens[0].nodes[0].text = 'Changed'; assert.notEqual(p.history[0].design.screens[0].nodes[0].text, 'Changed');
});
test('contrast calculations and readability fixes use actual tokens', () => {
  assert.equal(contrast('#000000', '#ffffff'), 21);
  const d = templateDesign('An app', '', 'Modern'); d.theme.text = '#f6f4fc'; d.theme.fontSize = 12;
  assert.ok(review(d).some(f => !f.pass)); localRefine(d, 'Improve accessibility'); assert.ok(review(d).every(f => f.pass));
  applyPalette(d, 'dark'); assert.ok(review(d).every(f => f.pass));
});
test('unknown local commands do not pretend to be AI edits', () => {
  const d = templateDesign('An app', '', 'Modern'), before = structuredClone(d);
  assert.throws(() => localRefine(d, 'Create a payment subscription screen'), /Connect an AI server/);
  assert.deepEqual(d, before);
});
test('exports escape markup and React Native output parses as TSX', () => {
  const d = templateDesign('An app', '', 'Modern');
  d.screens[0].nodes[0].text = '<script>alert("x")</script>{unsafe}';
  const html = htmlExport(d); assert.ok(!html.includes('<script>alert')); assert.ok(html.includes('&lt;script&gt;'));
  assert.equal(escapeHtml('"<&'), '&quot;&lt;&amp;');
  const rn = reactNativeExport(d);
  const result = ts.transpileModule(rn, { compilerOptions: { jsx: ts.JsxEmit.React, target: ts.ScriptTarget.ES2020 }, fileName: 'App.tsx', reportDiagnostics: true });
  assert.equal(result.diagnostics?.length, 0);
});
test('project backup round trips and rejects malformed data', () => {
  const p = newProject('Food app', templateDesign('Food app', '', 'Modern'), 'template');
  assert.deepEqual(parseImport(JSON.stringify(p)), [p]);
  assert.deepEqual(parseImport(JSON.stringify({ format: 'designflow-v1', projects: [p] })), [p]);
  assert.throws(() => parseImport('{"id":"bad"}'));
});
