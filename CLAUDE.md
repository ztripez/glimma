# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Glimma is a **plain-text animation language** ("Markdown for motion") that compiles to SVG/CSS animations. It's a domain-specific language (DSL) built with TypeScript and PEG.js that generates zero-dependency output.

## Key Commands

```bash
# Build & Development
npm run build        # Compile TypeScript + generate PEG.js parser
npm run lint         # TypeScript type checking (use for validation)
npm test            # Run Node.js built-in test runner
npm run docs        # Build example SVGs for documentation

# Development mode
npm run dev         # Watch files + serve Jekyll docs (parallel)

# CLI Usage (after build)
glimma build hello.glimma           # Compile to SVG
glimma build hello.glimma --html    # Compile to HTML
glimma lint hello.glimma            # Validate syntax
```

## Build Process

1. **Pre-build step**: `src/parser/grammar.pegjs` → `src/parser/index.ts` (PEG.js compilation)
2. **TypeScript compilation**: `src/` → `dist/` (ES2020/Node16 modules)
3. **CLI binary**: Available at `dist/cli/index.js`

## Architecture

- **`/src/cli/`** - Command-line interface implementation
- **`/src/parser/`** - PEG.js grammar (`grammar.pegjs`) and parser logic
- **`/src/renderer/`** - SVG/HTML output generation
- **`/src/types/`** - TypeScript type definitions
- **`/examples/`** - 13 sample .glimma files (used for testing and docs)
- **`/docs/`** - Jekyll-based GitHub Pages site

## Language Syntax

Glimma files use declarative syntax with scenes, shapes, groups, and timelines:

```glimma
scene demo {
  shape box rect x=10 y=10 width=100 height=50 fill="skyblue"
  timeline:
    0s: box fadeIn over 2s
}
```

## Testing

Uses Node.js built-in test runner. Tests cover:
- Parser validation (all examples must parse)
- CLI integration
- Error handling and syntax validation
- SVG/HTML output generation

## Configuration Notes

- ES modules only (`"type": "module"` in package.json)
- TypeScript strict mode enabled
- PEG.js grammar compilation required before TypeScript build
- Jekyll documentation requires Ruby/Bundler for local development