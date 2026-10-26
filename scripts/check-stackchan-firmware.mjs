import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const firmwareDir = resolve(root, 'public/firmware/stackchan-cores3');
const manifest = JSON.parse(readFileSync(resolve(firmwareDir, 'manifest.json'), 'utf8'));
const build = manifest.builds?.[0];
const expected = [
  ['bootloader.bin', 0x000000, 23296, '5e5543cfa073d9266779279d57b2320f307c71b3bc1d2bc402d12b4398e37f86'],
  ['partition-table.bin', 0x008000, 3072, '72cfe741ca9f22bed5eb2676409ebe2b57c10647f9224b7387309f6c535ba04a'],
  ['bootctl.bin', 0x00d000, 8192, 'aa513296dcbd3daeff1da6c57eaa7d061b30aaa13128ab8f4c164da1aa81185a'],
  ['recovery.bin', 0x010000, 999392, 'a2be97be8e0c188cf20a86dbb3656984bf4297b96b31962c67056ad7a1e5ae1c'],
  ['exttab.bin', 0x190000, 8192, 'f37496d4f6092a9ab4fb60023f7712033debcb711120ffa4c952a585e3fdca31'],
  ['stackchan_idf.bin', 0x1a0000, 5072832, '2172cba7df14e9a836d0630e9cddbcf24c597f3ca9aebdea8f7bc0eb69792aff'],
];

if (manifest.builds?.length !== 1 || build?.chipFamily !== 'ESP32-S3' || build.parts?.length !== expected.length) {
  throw new Error('Unexpected Stack-chan CoreS3 installer manifest');
}
if ('new_install_prompt_erase' in manifest) {
  throw new Error('Stack-chan installer must not request a full erase; NVS settings must be preserved');
}

for (const [index, [path, offset, size, expectedHash]] of expected.entries()) {
  const part = build.parts[index];
  if (part.path !== path || part.offset !== offset) throw new Error(`Unexpected manifest entry for ${path}`);
  const image = readFileSync(resolve(firmwareDir, path));
  const hash = createHash('sha256').update(image).digest('hex');
  if (image.length !== size || hash !== expectedHash) {
    throw new Error(`${path} size or SHA-256 changed: ${image.length} bytes, ${hash}`);
  }
}

const bootloader = readFileSync(resolve(firmwareDir, 'bootloader.bin'));
const partitionTable = readFileSync(resolve(firmwareDir, 'partition-table.bin'));
const recovery = readFileSync(resolve(firmwareDir, 'recovery.bin'));
const app = readFileSync(resolve(firmwareDir, 'stackchan_idf.bin'));
if (bootloader[0] !== 0xe9 || partitionTable[0] !== 0xaa || partitionTable[1] !== 0x50 || recovery[0] !== 0xe9 || app[0] !== 0xe9) {
  throw new Error('Stack-chan firmware image magic does not match the expected ESP32-S3 layout');
}
console.log(`Stack-chan CoreS3 firmware verified: ${expected.length} parts, ${expected.reduce((sum, part) => sum + part[2], 0)} bytes`);
