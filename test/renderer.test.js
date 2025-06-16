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

const multiSceneSrc = `scene first {\n  shape a rect x=0 y=0 width=10 height=10\n  timeline:\n    0s: a fadeIn over 1s\n    1s: a fadeOut over 1s\n}\nscene second {\n  shape b rect x=20 y=0 width=10 height=10\n  timeline:\n    0s: b fadeIn over 1s\n    1s: b fadeOut over 1s\n}`;

test('scene transitions do not overlap', () => {
  const ast = parse(multiSceneSrc);
  const svg = renderSvg(ast);
  const firstMatch = svg.match(/#first { animation: sceneTransition-0 (\d+(?:\.\d+)?)s ease-in-out (\d+(?:\.\d+)?)s;/);
  const secondMatch = svg.match(/#second { animation: sceneTransition-1 (\d+(?:\.\d+)?)s ease-in-out (\d+(?:\.\d+)?)s;/);
  assert(firstMatch && secondMatch);
  const firstDuration = parseFloat(firstMatch[1]);
  const firstStart = parseFloat(firstMatch[2]);
  const secondStart = parseFloat(secondMatch[2]);
  assert(secondStart >= firstStart + firstDuration + 1);
});
