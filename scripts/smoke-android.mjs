// Run only against a disposable emulator. ADB_PATH may select a local Android SDK.
import { execFileSync } from 'node:child_process';
import { _android } from '@playwright/test';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const adbPath = process.env.ADB_PATH || 'adb';
const serial = process.env.ANDROID_SERIAL || 'emulator-5554';
if (!serial.startsWith('emulator-')) throw new Error('Use a disposable emulator for this smoke test.');
const adb = (...args) => execFileSync(adbPath, ['-s', serial, ...args], { encoding: 'utf8', timeout: 45000 });
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const packageName = 'com.designflow.ai';
console.log(adb('install', '-r', resolve('artifacts/DesignFlow-AI-debug.apk')).trim());
adb('shell', 'am', 'start', '-W', '-n', packageName + '/.MainActivity');
async function connect() {
  const devices = await _android.devices();
  const device = devices.find(d => d.serial() === serial);
  if (!device) throw new Error('Test emulator is not connected.');
  const webview = await device.webView({ pkg: packageName }, { timeout: 45000 });
  const page = await webview.page();
  await page.getByRole('link', { name: 'Create a project', exact: true }).waitFor({ timeout: 45000 });
  console.log('Connected to Android WebView.');
  return { device, page };
}
let { device, page } = await connect();
const errors = []; page.on('pageerror', error => errors.push(error.message));
await page.screenshot({ path: 'artifacts/android-home.png' });
await page.getByRole('link', { name: 'Create a project', exact: true }).click();
await page.getByLabel('Your idea', { exact: true }).fill('Fitness coaching for beginners');
await page.getByRole('button', { name: 'Create design', exact: true }).click();
await page.getByRole('heading', { name: 'Forma', exact: true }).waitFor();
await page.getByRole('link', { name: 'Studio', exact: true }).click();
await page.getByRole('button', { name: 'Edit Make space for you.', exact: true }).waitFor();
await page.screenshot({ path: 'artifacts/android-studio.png' });
await device.close();
adb('shell', 'am', 'force-stop', packageName);
adb('shell', 'am', 'start', '-W', '-n', packageName + '/.MainActivity');
({ device, page } = await connect());
await page.getByRole('heading', { name: 'Forma', exact: true }).waitFor();
await page.getByRole('link', { name: 'Open Forma', exact: true }).click();
await page.getByRole('link', { name: 'Export', exact: true }).click();
await page.getByRole('button', { name: 'Export project', exact: true }).click();
let exported;
for (let i = 0; i < 10; i++) {
  try { exported = JSON.parse(adb('shell', 'run-as', packageName, 'cat', 'cache/designflow-project.json')); break; } catch { await pause(500); }
}
assert.equal(exported?.design.name, 'Forma');
const share = adb('shell', 'dumpsys', 'activity', 'activities');
writeFileSync('artifacts/android-share-activity.txt', share);
assert.match(share, /ChooserActivity|ResolverActivity/);
adb('shell', 'screencap', '-p', '/sdcard/designflow-share.png');
adb('pull', '/sdcard/designflow-share.png', resolve('artifacts/android-share.png'));
adb('shell', 'input', 'keyevent', '4');
assert.deepEqual(errors, []);
await device.close();
console.log('PASS: Android launch, creation, native persistence after force-stop, native file export, and share sheet.');
