#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { parse, SyntaxError } from '../parser/index.js';
import { renderSvg, renderHtml } from '../renderer/index.js';

function showHelp() {
  console.log(`
Glimma - Plain-text animation language

USAGE:
  glimma <command> [options]

COMMANDS:
  build <file.glimma> [output]  Compile to SVG or HTML (default: out.svg)
  lint <file.glimma>           Validate syntax and report errors
  preview <file.glimma>        Launch local server with auto-reload
  init [dir]                   Generate example files and CSS theme
  help                         Show this help message

OPTIONS:
  --html                       Output HTML instead of SVG (for build command)
  --theme=file.css             Apply CSS theme to output (for build command)

EXAMPLES:
  glimma build hello.glimma
  glimma build hello.glimma --html
  glimma build hello.glimma output.svg
  glimma build hello.glimma --theme=dark.css
  glimma lint hello.glimma
  glimma preview hello.glimma
  glimma init examples/
`);
}

function formatParseError(error: SyntaxError, filename: string): string {
  if (error.location) {
    const { line, column } = error.location.start;
    return `${filename}:${line}:${column}: ${error.message}`;
  }
  return `${filename}: ${error.message}`;
}

function buildCommand(args: string[]) {
  const htmlIdx = args.indexOf('--html');
  const useHtml = htmlIdx !== -1;
  if (htmlIdx !== -1) args.splice(htmlIdx, 1);
  
  const themeIdx = args.findIndex(arg => arg.startsWith('--theme='));
  let themeFile: string | undefined;
  if (themeIdx !== -1) {
    themeFile = args[themeIdx].split('=')[1];
    args.splice(themeIdx, 1);
  }

  const [input, outFile = useHtml ? 'out.html' : 'out.svg'] = args;

  if (!input) {
    console.error('Error: Input file required');
    console.error('Usage: glimma build <file.glimma> [output] [--html] [--theme=file.css]');
    process.exit(1);
  }

  try {
    const src = fs.readFileSync(path.resolve(input), 'utf8');
    const ast = parse(src);
    
    // Load theme CSS if provided
    let themeCSS = '';
    if (themeFile && fs.existsSync(path.resolve(themeFile))) {
      themeCSS = fs.readFileSync(path.resolve(themeFile), 'utf8');
    }
    
    const output = useHtml ? renderHtml(ast, themeCSS) : renderSvg(ast, themeCSS);
    fs.writeFileSync(path.resolve(outFile), output);
    console.log(`Wrote ${outFile}`);
    if (themeFile) {
      console.log(`Applied theme: ${themeFile}`);
    }
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.error('Parse error:', formatParseError(err, input));
    } else {
      console.error('Error:', err instanceof Error ? err.message : err);
    }
    process.exit(1);
  }
}

function lintCommand(args: string[]) {
  const [input] = args;

  if (!input) {
    console.error('Error: Input file required');
    console.error('Usage: glimma lint <file.glimma>');
    process.exit(1);
  }

  try {
    const src = fs.readFileSync(path.resolve(input), 'utf8');
    parse(src);
    console.log(`✓ ${input} - syntax OK`);
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.error('✗ Parse error:', formatParseError(err, input));
      process.exit(1);
    } else {
      console.error('Error:', err instanceof Error ? err.message : err);
      process.exit(1);
    }
  }
}

function previewCommand(args: string[]) {
  console.error('Preview command not yet implemented');
  console.error('Use: glimma build <file> --html && open output.html');
  process.exit(1);
}

function initCommand(args: string[]) {
  const [targetDir = '.'] = args;
  
  try {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    const exampleGlimma = `# Simple fade-in example
scene demo {
  shape box rect x=10 y=10 width=100 height=50 fill="skyblue"
  shape label text content="Hello, Glimma!" x=20 y=40
  
  timeline:
    0s: box fadeIn over 2s
    0.5s: label fadeIn over 2s
}`;

    const exampleCss = `/* Glimma theme template */
svg {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.glimma-shape {
  filter: drop-shadow(0 1px 3px rgba(0,0,0,0.1));
}

.glimma-text {
  font-family: -apple-system, system-ui, sans-serif;
  font-size: 14px;
}`;

    fs.writeFileSync(path.join(targetDir, 'example.glimma'), exampleGlimma);
    fs.writeFileSync(path.join(targetDir, 'theme.css'), exampleCss);
    
    console.log(`✓ Created ${path.join(targetDir, 'example.glimma')}`);
    console.log(`✓ Created ${path.join(targetDir, 'theme.css')}`);
    console.log(`\nTry: glimma build ${path.join(targetDir, 'example.glimma')}`);
  } catch (err) {
    console.error('Error creating files:', err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

// Main CLI logic
const args = process.argv.slice(2);
const [command, ...commandArgs] = args;

// Handle legacy usage (backwards compatibility)
if (!command || (!['build', 'lint', 'preview', 'init', 'help'].includes(command) && command.endsWith('.glimma'))) {
  // Legacy: glimma file.glimma [output] [--html]
  buildCommand(args);
  process.exit(0);
}

switch (command) {
  case 'build':
    buildCommand(commandArgs);
    break;
  case 'lint':
    lintCommand(commandArgs);
    break;
  case 'preview':
    previewCommand(commandArgs);
    break;
  case 'init':
    initCommand(commandArgs);
    break;
  case 'help':
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    console.error(`Unknown command: ${command}`);
    showHelp();
    process.exit(1);
}
