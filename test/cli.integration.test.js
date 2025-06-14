import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function runCLI(args) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', ['dist/cli/index.js', ...args], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });
    
    child.on('error', reject);
  });
}

test('CLI help command', async () => {
  const result = await runCLI(['help']);
  assert.equal(result.code, 0);
  assert(result.stdout.includes('Glimma - Plain-text animation language'));
  assert(result.stdout.includes('COMMANDS:'));
});

test('CLI lint command with valid file', async () => {
  const result = await runCLI(['lint', 'examples/01-fade.glimma']);
  assert.equal(result.code, 0);
  assert(result.stdout.includes('syntax OK'));
});

test('CLI lint command with invalid file', async () => {
  // Create a temporary invalid file
  const invalidFile = 'test-invalid.glimma';
  fs.writeFileSync(invalidFile, 'invalid syntax here');
  
  try {
    const result = await runCLI(['lint', invalidFile]);
    assert.equal(result.code, 1);
    assert(result.stderr.includes('Parse error'));
  } finally {
    fs.unlinkSync(invalidFile);
  }
});

test('CLI build command creates output file', async () => {
  const outputFile = 'test-output.svg';
  
  try {
    const result = await runCLI(['build', 'examples/01-fade.glimma', outputFile]);
    assert.equal(result.code, 0);
    assert(result.stdout.includes(`Wrote ${outputFile}`));
    assert(fs.existsSync(outputFile));
    
    const content = fs.readFileSync(outputFile, 'utf8');
    assert(content.includes('<svg'));
    assert(content.includes('</svg>'));
  } finally {
    if (fs.existsSync(outputFile)) {
      fs.unlinkSync(outputFile);
    }
  }
});

test('CLI build command with HTML output', async () => {
  const outputFile = 'test-output.html';
  
  try {
    const result = await runCLI(['build', 'examples/01-fade.glimma', outputFile, '--html']);
    assert.equal(result.code, 0);
    assert(result.stdout.includes(`Wrote ${outputFile}`));
    assert(fs.existsSync(outputFile));
    
    const content = fs.readFileSync(outputFile, 'utf8');
    assert(content.includes('<!DOCTYPE html>'));
    assert(content.includes('<svg'));
  } finally {
    if (fs.existsSync(outputFile)) {
      fs.unlinkSync(outputFile);
    }
  }
});

test('CLI init command creates files', async () => {
  const testDir = 'test-init-dir';
  
  try {
    const result = await runCLI(['init', testDir]);
    assert.equal(result.code, 0);
    assert(result.stdout.includes('Created'));
    
    assert(fs.existsSync(path.join(testDir, 'example.glimma')));
    assert(fs.existsSync(path.join(testDir, 'theme.css')));
  } finally {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  }
});

test('CLI legacy usage (backwards compatibility)', async () => {
  const outputFile = 'test-legacy.svg';
  
  try {
    // Old format: glimma file.glimma output.svg
    const result = await runCLI(['examples/01-fade.glimma', outputFile]);
    assert.equal(result.code, 0);
    assert(result.stdout.includes(`Wrote ${outputFile}`));
    assert(fs.existsSync(outputFile));
  } finally {
    if (fs.existsSync(outputFile)) {
      fs.unlinkSync(outputFile);
    }
  }
});