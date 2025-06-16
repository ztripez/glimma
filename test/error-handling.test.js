import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { parse, SyntaxError } from '../dist/parser/index.js';

test('parser reports syntax errors with line/column info', () => {
  const invalidGlimma = `scene demo {
  shape box rect x=10 y=10
  timeline
    0s: box fadeIn over 2s
}`;

  assert.throws(
    () => parse(invalidGlimma),
    (err) => {
      assert(err instanceof SyntaxError);
      assert(err.location);
      assert.equal(typeof err.location.start.line, 'number');
      assert.equal(typeof err.location.start.column, 'number');
      return true;
    },
    'Should throw SyntaxError with location info'
  );
});

test('parser handles missing timeline duration', () => {
  const invalidGlimma = `scene demo {
  shape box rect x=10 y=10
  timeline:
    0s: box fadeIn
}`;

  assert.throws(
    () => parse(invalidGlimma),
    SyntaxError,
    'Should throw on missing duration'
  );
});

test('parser handles invalid shape type', () => {
  const invalidGlimma = `scene demo {
  shape box invalidtype x=10 y=10
}`;

  // This should parse successfully but will be invalid at render time
  // The parser is flexible about shape types
  const ast = parse(invalidGlimma);
  assert.equal(ast.scenes[0].items[0].shapeType, 'invalidtype');
});

test('parser handles unclosed scene block', () => {
  const invalidGlimma = `scene demo {
  shape box rect x=10 y=10`;

  assert.throws(
    () => parse(invalidGlimma),
    SyntaxError,
    'Should throw on unclosed block'
  );
});

test('parser handles invalid attribute syntax', () => {
  const invalidGlimma = `scene demo {
  shape box rect x y=10
}`;

  assert.throws(
    () => parse(invalidGlimma),
    SyntaxError,
    'Should throw on invalid attribute'
  );
});