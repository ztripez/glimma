import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const examplesDir = path.resolve('examples');
const outDir = path.resolve('docs/assets/examples');
fs.mkdirSync(outDir, { recursive: true });

const cli = path.resolve('dist/cli/index.js');

for (const file of fs.readdirSync(examplesDir)) {
  if (file.endsWith('.glimma')) {
    const input = path.join(examplesDir, file);
    const output = path.join(outDir, file.replace(/\.glimma$/, '.svg'));
    execFileSync('node', [cli, input, output]);
  }
}
console.log(`Built SVGs to ${outDir}`);
