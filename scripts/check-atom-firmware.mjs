import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const firmwareDir = resolve(root, 'public/firmware/atom-s3r');
const manifest = JSON.parse(readFileSync(resolve(firmwareDir, 'manifest.json'), 'utf8'));
const build = manifest.builds?.[0];
if (manifest.builds?.length !== 1 || build?.chipFamily !== 'ESP32-S3' || build.parts?.length !== 1 || build.parts[0].offset !== 0 || !manifest.new_install_prompt_erase) {
  throw new Error('Unexpected ATOM S3R installer manifest');
}
const expectedName = 'atoms3r-2026-10-25-merged.bin';
if (build.parts[0].path !== expectedName) throw new Error('Unexpected firmware path');
const image = readFileSync(resolve(firmwareDir, expectedName));
const sha256 = createHash('sha256').update(image).digest('hex');
if (image.length !== 3080192 || sha256 !== 'cb56a9d5905437ce034bc71c88ffb731ab5c09648e004527efa2989a855b6960') {
  throw new Error(`Firmware size or SHA-256 changed: ${image.length} bytes, ${sha256}`);
}
if (image[0] !== 0xe9 || image[0x8000] !== 0xaa || image[0x8001] !== 0x50 || image[0x10000] !== 0xe9) {
  throw new Error('Merged image is missing a bootloader, partition table, or app at the expected offset');
}
console.log(`ATOM S3R firmware verified: ${image.length} bytes, SHA-256 ${sha256}`);
