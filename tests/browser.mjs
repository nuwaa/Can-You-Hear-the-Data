import { chromium } from 'playwright';
import { strict as assert } from 'node:assert';

const baseUrl = process.env.PREVIEW_URL || 'http://127.0.0.1:4173/';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
try {
  for (const width of [390, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 850 } });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(baseUrl);
    assert.equal(await page.locator('h1').textContent(), 'Can You Hear the Data?');
    assert.match(await page.locator('.site-footer').textContent(), /Made by TOMINAGA/);
    assert.equal(await page.locator('.site-footer a').getAttribute('href'), 'https://x.com/4989er');
    await page.getByRole('link', { name: /How to use/ }).click();
    assert.match(await page.locator('.site-footer').textContent(), /Made by TOMINAGA/);
    assert.match(page.url(), /guide\.html#lang=en/);
    await page.getByRole('heading', { name: 'Send text through sound' }).waitFor();
    assert.equal(await page.locator('.guide-steps li').count(), 9);
    await page.getByRole('button', { name: '简体' }).click();
    assert.equal(await page.locator('h1').textContent(), '用声音发送文字');
    assert.match(await page.locator('.site-footer').textContent(), /富永制作/);
    await page.getByRole('button', { name: '繁體' }).click();
    assert.equal(await page.locator('h1').textContent(), '用聲音傳送文字');
    assert.match(await page.locator('.site-footer').textContent(), /富永製作/);
    assert.equal(await page.locator('html').getAttribute('lang'), 'zh-TW');
    assert.equal(await page.locator('.guide-steps li').count(), 9);
    await page.getByRole('button', { name: '日本語' }).click();
    assert.equal(await page.locator('h1').textContent(), '文字を音で送ろう');
    assert.match(await page.locator('.site-footer').textContent(), /富永がつくりました/);
    await page.getByRole('link', { name: /アプリに戻る/ }).click();
    assert.equal(await page.locator('h1').textContent(), 'Can You Hear the Data?');
    assert.match(await page.locator('.site-footer').textContent(), /富永がつくりました/);
    await page.getByRole('button', { name: 'ｽﾀｯｸﾁｬﾝは持ってますよね？' }).click();
    assert.equal(await page.locator('textarea').inputValue(), 'ｽﾀｯｸﾁｬﾝは持ってますよね？');
    await page.getByRole('button', { name: 'EN', exact: true }).click();
    assert.equal(await page.locator('.preset-group').count(), 3);
    assert.equal(await page.locator('.preset').count(), 10);
    await page.getByRole('button', { name: 'Can you hear the data?' }).click();
    assert.equal(await page.locator('textarea').inputValue(), 'Can you hear the data?');
    await page.getByRole('button', { name: 'Go get one!' }).click();
    assert.equal(await page.locator('textarea').inputValue(), 'Go get one!');
    await page.locator('textarea').fill('你'.repeat(47));
    assert.equal(await page.locator('.send').isEnabled(), false);
    await page.locator('textarea').fill('Hello Maker Faire!');
    assert.equal(await page.locator('.send').isEnabled(), true);
    assert.equal(await page.locator('.latest').evaluate(node => getComputedStyle(node).whiteSpace), 'pre-wrap');
    await page.locator('textarea').fill('First line\nSecond line');
    assert.equal(await page.locator('textarea').inputValue(), 'First line\nSecond line');
    assert.equal(await page.locator('.send').isEnabled(), true);
    await page.screenshot({ path: `/tmp/hear-data-${width}.png`, fullPage: true });
    assert.deepEqual(errors, []);
    await page.close();
  }
  const context = await browser.newContext();
  await context.addInitScript(() => { Object.defineProperty(navigator, 'mediaDevices', { value: { getUserMedia: async () => { throw new DOMException('Permission denied', 'NotAllowedError'); } } }); });
  const denied = await context.newPage(); await denied.goto(baseUrl);
  await denied.locator('.listen').click();
  await denied.locator('.alert').waitFor();
  assert.match(await denied.locator('.alert').textContent(), /Permission denied/);
  assert.equal(await denied.locator('.listen').isEnabled(), true);
  await context.close();
  const taiwan = await browser.newContext({ locale: 'zh-TW' });
  const taiwanPage = await taiwan.newPage();
  await taiwanPage.goto(baseUrl);
  assert.equal(await taiwanPage.locator('.listen').textContent(), '開始接收');
  await taiwanPage.getByRole('button', { name: '快去入手一個！' }).click();
  assert.equal(await taiwanPage.locator('textarea').inputValue(), '快去入手一個！');
  await taiwanPage.getByRole('link', { name: /使用說明/ }).click();
  await taiwanPage.getByRole('heading', { name: '用聲音傳送文字' }).waitFor();
  await taiwan.close();
  for (const [pageName, attribution] of [
    ['install.en.html', 'Made by TOMINAGA'],
    ['install.zh-CN.html', '富永制作'],
    ['install.zh-TW.html', '富永製作'],
    ['install.ja.html', '富永がつくりました'],
  ]) {
    const installer = await browser.newPage();
    await installer.goto(new URL(pageName, baseUrl).href);
    assert.match(await installer.locator('.site-footer').textContent(), new RegExp(attribution));
    assert.equal(await installer.locator('.site-footer a').getAttribute('href'), 'https://x.com/4989er');
    await installer.close();
  }
  for (const [language, label, pageName] of [
    ['en', 'Install on Stack-chan', 'install-stackchan.en.html'],
    ['zh', '安装到 M5 Stack-chan', 'install-stackchan.zh-CN.html'],
    ['zh-TW', '安裝到 M5 Stack-chan', 'install-stackchan.zh-TW.html'],
    ['ja', 'ｽﾀｯｸﾁｬﾝにインストール', 'install-stackchan.ja.html'],
  ]) {
    const home = await browser.newPage();
    await home.goto(`${baseUrl}#lang=${language}`);
    const installerLink = home.getByRole('link', { name: new RegExp(label) });
    assert.equal(await installerLink.getAttribute('href'), `./${pageName}`);
    await home.close();
    const guide = await browser.newPage();
    await guide.goto(`${baseUrl}guide.html#lang=${language}`);
    const guideInstallerLink = guide.getByRole('link', { name: new RegExp(label) });
    assert.equal(await guideInstallerLink.getAttribute('href'), `./${pageName}`);
    await guide.close();
  }
  const offline = await browser.newPage(); await offline.goto(baseUrl);
  await offline.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await offline.context().setOffline(true); await offline.reload();
  assert.equal(await offline.locator('h1').textContent(), 'Can You Hear the Data?');
  await offline.getByRole('link', { name: /How to use/ }).click();
  assert.match(offline.url(), /guide\.html/);
  await offline.close();
  console.log('Browser checks passed: mobile, desktop, multilingual guide and installer, author footer, byte limit, microphone denial, offline app and guide');
} finally { await browser.close(); }
