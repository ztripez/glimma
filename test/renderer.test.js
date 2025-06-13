import test from 'node:test';
import assert from 'node:assert/strict';
import { parse } from '../dist/parser/index.js';
import { renderSvg } from '../dist/renderer/index.js';

const src = `scene demo {\n  shape box rect x=0 y=0 width=10 height=10\n  timeline:\n    0s: box fadeIn over 1s\n    1s: box fadeOut over 1s\n}`;

test('renderSvg includes keyframes and shape', () => {
  const ast = parse(src);
  const svg = renderSvg(ast);
  assert.match(svg, /@keyframes fadeIn/);
  assert.match(svg, /@keyframes fadeOut/);
  assert.match(svg, /<rect id="box"/);
});
