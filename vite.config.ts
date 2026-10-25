import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('.', import.meta.url));
export default defineConfig({ base: './', build: { rollupOptions: { input: { app: resolve(root, 'index.html'), guide: resolve(root, 'guide.html') } } }, plugins: [VitePWA({ registerType: 'autoUpdate', injectRegister: 'auto', manifest: false, workbox: { globPatterns: ['**/*.{js,css,html,svg,webmanifest}'], navigateFallback: 'index.html', navigateFallbackAllowlist: [/\/(?:index\.html)?$/], cleanupOutdatedCaches: true } })] });
