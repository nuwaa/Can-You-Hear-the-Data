import { chromium } from 'playwright';
import { strict as assert } from 'node:assert';

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
try {
  for (const width of [390, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 850 } });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:4173/');
    assert.equal(await page.locator('h1').textContent(), 'Can You Hear the Data?');
    await page.locator('textarea').fill('你'.repeat(47));
    assert.equal(await page.locator('.send').isEnabled(), false);
    await page.locator('textarea').fill('Hello Maker Faire!');
    assert.equal(await page.locator('.send').isEnabled(), true);
    await page.screenshot({ path: `/tmp/hear-data-${width}.png`, fullPage: true });
    assert.deepEqual(errors, []);
    await page.close();
  }
  const context = await browser.newContext();
  await context.addInitScript(() => { Object.defineProperty(navigator, 'mediaDevices', { value: { getUserMedia: async () => { throw new DOMException('Permission denied', 'NotAllowedError'); } } }); });
  const denied = await context.newPage(); await denied.goto('http://127.0.0.1:4173/');
  await denied.locator('.listen').click();
  await denied.locator('.alert').waitFor();
  assert.match(await denied.locator('.alert').textContent(), /Permission denied/);
  assert.equal(await denied.locator('.listen').isEnabled(), true);
  await context.close();
  const offline = await browser.newPage(); await offline.goto('http://127.0.0.1:4173/');
  await offline.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await offline.context().setOffline(true); await offline.reload();
  assert.equal(await offline.locator('h1').textContent(), 'Can You Hear the Data?');
  await offline.close();
  console.log('Browser checks passed: mobile, desktop, byte limit, microphone denial, offline reload');
} finally { await browser.close(); }
