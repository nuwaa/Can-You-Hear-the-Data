import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('.', import.meta.url));
export default defineConfig({ base: './', build: { rollupOptions: { input: { app: resolve(root, 'index.html'), guide: resolve(root, 'guide.html'), install: resolve(root, 'install.html'), installEn: resolve(root, 'install.en.html'), installZhCN: resolve(root, 'install.zh-CN.html'), installZhTW: resolve(root, 'install.zh-TW.html'), installJa: resolve(root, 'install.ja.html'), installStackchanJa: resolve(root, 'install-stackchan.ja.html') } } }, plugins: [VitePWA({ registerType: 'autoUpdate', injectRegister: 'auto', manifest: false, workbox: { globPatterns: ['**/*.{js,css,html,svg,webmanifest}'], navigateFallback: 'index.html', navigateFallbackAllowlist: [/\/(?:index\.html)?$/], cleanupOutdatedCaches: true } })] });
