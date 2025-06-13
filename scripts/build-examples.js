import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const examplesDir = path.resolve('examples');
const assetsDir = path.resolve('docs/assets/examples');
const dataDir = path.resolve('docs/_data');
const dataFile = path.join(dataDir, 'examples.yml');

fs.mkdirSync(assetsDir, { recursive: true });
fs.mkdirSync(dataDir, { recursive: true });

const cli = path.resolve('dist/cli/index.js');

const examples = [];

const exampleFiles = fs.readdirSync(examplesDir)
  .filter(file => file.endsWith('.glimma'))
  .sort();

for (const file of exampleFiles) {
  const inputPath = path.join(examplesDir, file);
  const svgFile = file.replace(/\.glimma$/, '.svg');
  const svgPath = path.join(assetsDir, svgFile);

  // Generate SVG
  execFileSync('node', [cli, inputPath, svgPath]);

  const fileContent = fs.readFileSync(inputPath, 'utf-8');
  const lines = fileContent.split('\n');
  
  const comments = lines
    .filter(line => line.trim().startsWith('#'))
    .map(line => line.trim().substring(1).trim())
    .join('\n');

  const code = lines.filter(line => !line.trim().startsWith('#')).join('\n').trim();

  examples.push({
    name: file,
    comments,
    code,
    svg_path: `/assets/examples/${svgFile}`,
  });
}

fs.writeFileSync(dataFile, yaml.dump(examples));

console.log(`Built SVGs to ${assetsDir}`);
console.log(`Created data file at ${dataFile}`);
