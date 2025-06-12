import test from 'node:test';
import assert from 'node:assert/strict';
import { parse } from '../dist/parser/index.js';
import fs from 'node:fs';

const files = fs.readdirSync('examples').filter(f => f.endsWith('.glimma'));

for (const file of files) {
  test(`parse ${file}`, () => {
    const src = fs.readFileSync(`examples/${file}`, 'utf8');
    assert.doesNotThrow(() => parse(src));
  });
}
