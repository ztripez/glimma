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

{% for example in site.data.examples %}
## {{ example.name }}

{{ example.comments | markdownify }}

```glimma
{{ example.code }}
```

<img src="{{ example.svg_path | relative_url }}" alt="{{ example.name }}" width="100%" />
{% endfor %}
