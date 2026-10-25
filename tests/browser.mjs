import { chromium } from 'playwright';
import { strict as assert } from 'node:assert';

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
try {
  for (const width of [390, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 850 } });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:4173/');
    assert.equal(await page.locator('h1').textContent(), 'Can You Hear the Data?');
    await page.getByRole('link', { name: /How to use/ }).click();
    assert.match(page.url(), /guide\.html#lang=en/);
    await page.getByRole('heading', { name: 'Send text through sound' }).waitFor();
    assert.equal(await page.locator('.guide-steps li').count(), 9);
    await page.getByRole('button', { name: '简体' }).click();
    assert.equal(await page.locator('h1').textContent(), '用声音发送文字');
    await page.getByRole('button', { name: '繁體' }).click();
    assert.equal(await page.locator('h1').textContent(), '用聲音傳送文字');
    assert.equal(await page.locator('html').getAttribute('lang'), 'zh-TW');
    assert.equal(await page.locator('.guide-steps li').count(), 9);
    await page.getByRole('button', { name: '日本語' }).click();
    assert.equal(await page.locator('h1').textContent(), '文字を音で送ろう');
    await page.getByRole('link', { name: /アプリに戻る/ }).click();
    assert.equal(await page.locator('h1').textContent(), 'Can You Hear the Data?');
    await page.getByRole('button', { name: 'EN', exact: true }).click();
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
  const taiwan = await browser.newContext({ locale: 'zh-TW' });
  const taiwanPage = await taiwan.newPage();
  await taiwanPage.goto('http://127.0.0.1:4173/');
  assert.equal(await taiwanPage.locator('.listen').textContent(), '開始接收');
  await taiwanPage.getByRole('link', { name: /使用說明/ }).click();
  await taiwanPage.getByRole('heading', { name: '用聲音傳送文字' }).waitFor();
  await taiwan.close();
  const offline = await browser.newPage(); await offline.goto('http://127.0.0.1:4173/');
  await offline.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await offline.context().setOffline(true); await offline.reload();
  assert.equal(await offline.locator('h1').textContent(), 'Can You Hear the Data?');
  await offline.getByRole('link', { name: /How to use/ }).click();
  assert.match(offline.url(), /guide\.html/);
  await offline.close();
  console.log('Browser checks passed: mobile, desktop, multilingual guide, byte limit, microphone denial, offline app and guide');
} finally { await browser.close(); }
