import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import peg from 'pegjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Use grammar file from source directory even after compilation
const grammarPath = path.resolve(__dirname, '../../src/parser/grammar.pegjs');
const grammar = fs.readFileSync(grammarPath, 'utf8');
const parser = peg.generate(grammar);

export type ASTNode = any;

export function parse(input: string): ASTNode {
  return parser.parse(input);
}
