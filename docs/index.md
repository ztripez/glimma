---
title: Glimma
layout: default
---

# Glimma

**Plain‑text animation language — Markdown for motion**

Glimma lets you storyboard lightweight SVG/CSS animations with a clear, text-based syntax. A single `.glimma` file defines shapes, groups, scenes and timelines; the CLI outputs self-contained SVG animations or HTML wrappers.

## Key features

- **Clarity over flash** – perfect for architects, researchers and engineers who need to explain ideas.
- **Plain text source** – version-control friendly and easy to review.
- **Zero‑dependency output** – generates vanilla SVG + CSS; no runtime frameworks.
- **Scenes & groups** – structure complex flows without hand‑animating every part.
- **Theming** – attach a CSS file to match brand guidelines.

See the [Glimma DSL Specification](spec.md) for language details and the [project README](../README.md) for installation and usage instructions.

For a tour of all sample scripts, visit the [Examples gallery](examples.md).
Run `npm run docs` to build the SVG previews used throughout the site.

## Examples

The repository includes a gallery of sample scripts under `/examples`. Build one with the CLI:

```bash
npx glimma build examples/01-fade.glimma examples/out.svg
```

### `01-fade.glimma`

```glimma
scene demo {
  shape box rect x=10 y=10 width=100 height=50 fill="skyblue"
  shape label text content="Hello" x=20 y=40
  timeline:
    0s: box fadeIn over 1s
    0.5s: label fadeIn over 1s
}
```

The resulting SVG is viewable in any browser:

![Fade example](assets/examples/features.svg)

