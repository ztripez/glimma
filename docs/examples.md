---
title: Example Gallery
layout: default
---

# Example Gallery

Below are all of the `.glimma` scripts included in this repository. Build any of them with:

```bash
npx glimma build examples/01-fade.glimma examples/out.svg
```

Replace `01-fade.glimma` with the desired example.
Running `npm run docs` will regenerate all SVG previews and this page.
The examples loop indefinitely in the gallery so you can see each animation in full.

{% for example in site.data.examples %}
## {{ example.name }}

{{ example.comments | markdownify }}

```glimma
{{ example.code }}
```

<object type="image/svg+xml" data="{{ example.svg_path | relative_url }}" width="100%" aria-label="{{ example.name }}"></object>
{% endfor %}
