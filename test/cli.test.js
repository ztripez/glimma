import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const outFile = path.join('test', 'tmp.svg');

// ensure cleanup
try { fs.unlinkSync(outFile); } catch {}

test('CLI writes SVG file', () => {
<<<<<<< fk5a5z-codex/create-mvp-for-plain-text-animation-language
  execFileSync('node', ['dist/cli/index.js', 'examples/01-fade.glimma', outFile]);
=======
  execFileSync('node', ['dist/cli/index.js', 'examples/intro.glimma', outFile]);
>>>>>>> main
  const exists = fs.existsSync(outFile);
  assert.ok(exists);
  // Clean up
  fs.unlinkSync(outFile);
});
