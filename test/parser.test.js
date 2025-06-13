import test from 'node:test';
import assert from 'node:assert/strict';
import { parse } from '../dist/parser/index.js';
<<<<<<< fk5a5z-codex/create-mvp-for-plain-text-animation-language
import fs from 'node:fs';

const files = fs.readdirSync('examples').filter(f => f.endsWith('.glimma'));

for (const file of files) {
  test(`parse ${file}`, () => {
    const src = fs.readFileSync(`examples/${file}`, 'utf8');
    assert.doesNotThrow(() => parse(src));
  });
}
=======

const src = `scene demo {
  shape rect1 rect x=1 y=2 width=3 height=4
  shape circle1 circle cx=5 cy=6 r=7
  shape text1 text content="hi" x=8 y=9
  shape path1 path d="M0 0L1 1"
  timeline:
    0s: rect1 fadeIn over 1s
}`;

test('parse all shape types and timeline', () => {
  const ast = parse(src);
  assert.equal(ast.scenes.length, 1);
  const scene = ast.scenes[0];
  assert.equal(scene.items.filter(i => i.type==='Shape').length, 4);
  const tl = scene.items.find(i => i.type==='Timeline');
  assert.ok(tl, 'timeline exists');
  assert.equal(tl.entries.length, 1);
  assert.equal(tl.entries[0].action, 'fadeIn');
});
>>>>>>> main
