# Glimma

**Plain‑text animation language — Markdown for motion**

Glimma lets you storyboard lightweight SVG/CSS animations in the same way Markdown lets you write documents. One `.glimma` file defines shapes, groups, scenes and timelines; the CLI turns it into a self-contained SVG animation by default (add `--html` to wrap in an HTML page).

> *If adding a feature makes the script harder to read than the concept it explains, drop it.* — Glimma founding rule

---

## Why Glimma ?

* **Clarity over flash** – perfect for architects, researchers and engineers who need to *explain* ideas to non‑technical stakeholders.
* **Plain text source** – version‑control friendly, easy to diff and review.
* **Zero‑dependency output** – generates vanilla SVG + CSS; no runtime frameworks.
* **Scenes & groups** – structure complex flows without hand‑animating every part.
* **Theming** – attach a CSS file to match brand guidelines.

---

## Quick start

```bash
# Install the CLI globally (requires Node 18+)
npm install -g glimma

# Create a simple animation script
echo "" > hello.glimma
```

`hello.glimma` →

```glimma
scene Intro {
  shape box rect  w=120 h=80 fill=#6699cc
  shape title text content="Hello, Glimma!" x=10 y=100

  timeline:
    0s: box fadeIn over 0.5s
    0.5s: box move x=200 over 1s
    1.6s: title fadeIn over 0.4s
}
```

Build & preview:

```bash
glimma build hello.glimma -o hello.svg
open hello.svg   # on macOS; or just double-click in Finder
```

Add `--html` if you want an HTML wrapper instead of raw SVG.

---

## CLI cheatsheet


## Building from source

```bash
npm install
npm run build
node dist/cli/index.js examples/01-fade.glimma examples/out.svg
```

| Command                 | Purpose                                          |
| ----------------------- | ------------------------------------------------ |
| `glimma build <file>`   | Compile to SVG (default `out.svg`, add `--html` for HTML). |
| `glimma preview <file>` | Launch local web server with auto‑reload.        |
| `glimma lint <file>`    | Validate syntax, report line/col errors.         |
| `glimma init`           | Generate example scripts and CSS theme skeleton. |

## Development

Run TypeScript checks and tests with npm:

```bash
npm run lint
npm test
```

Use `npm run docs` to rebuild the example SVGs used by the GitHub Pages site.

---

## Project status

Glimma is **pre‑MVP**. Core spec lives in [`/docs/spec.md`](./docs/spec.md). Planned milestones:

1. Parser + unit tests (week 1).
2. Renderer prototype (week 2).
3. CLI wrapper & docs (week 3).
4. Internal demo & feedback (week 4).

See the [roadmap](./ROADMAP.md) for details.

---

## Contributing

Pull requests are welcome once the parser skeleton lands. Please read [`CONTRIBUTING.md`](./CONTRIBUTING.md) for coding standards, commit message format, and the **Foundational Rule** that trumps all feature proposals.

---

## License

[MIT](./LICENSE)
