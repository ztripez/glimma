import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { parse } from '../dist/parser/index.js';
import { renderSvg, renderHtml } from '../dist/renderer/index.js';

test('renderSvg applies theme CSS', () => {
  const glimmaSource = `scene demo {
  shape box rect x=10 y=10 width=50 height=30 fill="blue"
  timeline:
    0s: box fadeIn over 1s
}`;

  const themeCSS = `
svg {
  background: #f0f0f0;
  border: 2px solid #333;
}

rect {
  stroke: #000;
  stroke-width: 2;
}`;

  const ast = parse(glimmaSource);
  const svg = renderSvg(ast, themeCSS);
  
  assert(svg.includes('<style>'));
  assert(svg.includes('background: #f0f0f0'));
  assert(svg.includes('stroke: #000'));
  assert(svg.includes('@keyframes fadeIn'));
});

test('renderSvg works without theme CSS', () => {
  const glimmaSource = `scene demo {
  shape box rect x=10 y=10 width=50 height=30 fill="blue"
  timeline:
    0s: box fadeIn over 1s
}`;

  const ast = parse(glimmaSource);
  const svg = renderSvg(ast);
  
  assert(svg.includes('<svg'));
  assert(svg.includes('@keyframes fadeIn'));
  assert(!svg.includes('background: #f0f0f0'));
});

test('renderHtml includes theme CSS in HTML wrapper', () => {
  const glimmaSource = `scene demo {
  shape box rect x=10 y=10 width=50 height=30 fill="blue"
}`;

  const themeCSS = `body { margin: 0; padding: 20px; }`;

  const ast = parse(glimmaSource);
  const html = renderHtml(ast, themeCSS);
  
  assert(html.includes('<!DOCTYPE html>'));
  assert(html.includes('<html>'));
  assert(html.includes('body { margin: 0; padding: 20px; }'));
  assert(html.includes('<svg'));
});

test('theme CSS and animation CSS are properly separated', () => {
  const glimmaSource = `scene demo {
  shape box rect x=10 y=10 width=50 height=30 fill="blue"
  timeline:
    0s: box fadeIn over 1s
}`;

  const themeCSS = `/* Theme styles */\nsvg { background: white; }`;

  const ast = parse(glimmaSource);
  const svg = renderSvg(ast, themeCSS);
  
  // Both theme and animation CSS should be present
  assert(svg.includes('/* Theme styles */'));
  assert(svg.includes('@keyframes fadeIn'));
  
  // They should be separated by double newline
  assert(svg.includes('svg { background: white; }\n\n@keyframes'));
});