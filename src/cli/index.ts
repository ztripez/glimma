#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { parse } from '../parser/index.js';
import { renderSvg, renderHtml } from '../renderer/index.js';

const args = process.argv.slice(2);
const htmlIdx = args.indexOf('--html');
const useHtml = htmlIdx !== -1;
if (htmlIdx !== -1) args.splice(htmlIdx, 1);

const [input, outFile = useHtml ? 'out.html' : 'out.svg'] = args;

if (!input) {
  console.error('Usage: glimma <file.glimma> [out.svg|out.html] [--html]');
  process.exit(1);
}

try {
  const src = fs.readFileSync(path.resolve(input), 'utf8');
  const ast = parse(src);
  const output = useHtml ? renderHtml(ast) : renderSvg(ast);
  fs.writeFileSync(path.resolve(outFile), output);
  console.log(`Wrote ${outFile}`);
} catch (err) {
  console.error('Error:', err instanceof Error ? err.message : err);
  process.exit(1);
}
