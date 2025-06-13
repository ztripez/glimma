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
Running `npm run docs` will regenerate all SVG previews under `docs/assets/examples`.


## 01-fade.glimma

```glimma
scene demo {
  shape box rect x=10 y=10 width=100 height=50 fill="skyblue"
  shape label text content="Hello" x=20 y=40
  timeline:
    0s: box fadeIn over 1s
    0.5s: label fadeIn over 1s
}

```

![Result](assets/examples/01-fade.svg)


## 02-move-plus-fade.glimma

```glimma
scene demo {
  shape rect1 rect x=10 y=10 width=50 height=30 fill="#ff9999"
  shape circle1 circle cx=80 cy=25 r=15 fill="#99ccff"
  shape text1 text content="Hi" x=10 y=70
  shape path1 path d="M10 80 L60 80" stroke="black"
  timeline:
    0s: rect1 fadeIn over 0.5s
    0.5s: circle1 fadeIn over 0.5s
    1s: text1 fadeIn over 0.5s
    1.5s: path1 fadeIn over 0.5s
}

```

![Result](assets/examples/02-move-plus-fade.svg)


## 03-overlap-two-shapes.glimma

```glimma
scene demo {
  shape box rect x=10 y=50 width=60 height=40 fill="#6699cc"
  shape circle circle cx=20 cy=20 r=15 fill="#88cc88"
  timeline:
    0s: box fadeIn over 0.5s
    0.5s: circle fadeIn over 0.5s
}

```

![Result](assets/examples/03-overlap-two-shapes.svg)


## 04-csv-multi-target.glimma

```glimma
scene demo {
  shape first rect x=10 y=10 width=40 height=40 fill="#6699cc"
  shape second rect x=60 y=10 width=40 height=40 fill="#cc6666"
  timeline:
    0s: first fadeIn over 0.5s
    0s: second fadeIn over 0.5s
}

```

![Result](assets/examples/04-csv-multi-target.svg)


## 05-group-and-child.glimma

```glimma
scene demo {
  group parent {
    shape box rect x=10 y=10 width=40 height=40 fill="#6699cc"
    shape child circle cx=30 cy=30 r=10 fill="#88cc88"
  }
  timeline:
    0s: parent fadeIn over 0.5s
    0.5s: child fadeOut over 0.5s
}

```

![Result](assets/examples/05-group-and-child.svg)


## 06-rotate.glimma

```glimma
scene demo {
  shape wheel rect x=20 y=20 width=40 height=40 fill="#cc6666"
  timeline:
    0s: wheel fadeIn over 0.5s
}

```

![Result](assets/examples/06-rotate.svg)


## 07-scale.glimma

```glimma
scene demo {
  shape box rect x=10 y=10 width=40 height=40 fill="#6699cc"
  timeline:
    0s: box fadeIn over 0.5s
}

```

![Result](assets/examples/07-scale.svg)


## 08-scene-fade.glimma

```glimma
scene first {
  shape box rect x=10 y=10 width=40 height=40 fill="#6699cc"
  timeline:
    0s: box fadeIn over 0.5s
}

scene second {
  shape other rect x=60 y=10 width=40 height=40 fill="#cc6666"
  timeline:
    0s: other fadeIn over 0.5s
}

```

![Result](assets/examples/08-scene-fade.svg)


## 09-scene-slide.glimma

```glimma
scene demo {
  shape box rect x=10 y=10 width=40 height=40 fill="#6699cc"
  timeline:
    0s: box fadeIn over 0.5s
}

```

![Result](assets/examples/09-scene-slide.svg)


## 10-easing-matrix.glimma

```glimma
scene demo {
  shape a rect x=10 y=10 width=20 height=20 fill="#6699cc"
  shape b rect x=40 y=10 width=20 height=20 fill="#88cc88"
  shape c rect x=70 y=10 width=20 height=20 fill="#cc6666"
  shape d rect x=100 y=10 width=20 height=20 fill="#cccc66"
  timeline:
    0s: a fadeIn over 0.5s
    0s: b fadeIn over 0.5s
    0s: c fadeIn over 0.5s
    0s: d fadeIn over 0.5s
}

```

![Result](assets/examples/10-easing-matrix.svg)


## 11-seq-fadeIn-fadeOut.glimma

```glimma
scene demo {
  shape box rect x=10 y=10 width=40 height=40 fill="#6699cc"
  timeline:
    0s: box fadeIn over 0.5s
    1s: box fadeOut over 0.5s
}

```

![Result](assets/examples/11-seq-fadeIn-fadeOut.svg)


## 12-override-edge.glimma

```glimma
scene demo {
  shape box rect x=10 y=10 width=40 height=40 fill="#6699cc"
  timeline:
    0s: box fadeIn over 0.5s
    0.2s: box fadeIn over 0.5s
}

```

![Result](assets/examples/12-override-edge.svg)


## features.glimma

```glimma
scene demo {
  shape rect1 rect x=10 y=10 width=50 height=30 fill="#ff9999"
  shape circle1 circle cx=80 cy=25 r=15 fill="#99ccff"
  shape text1 text content="Hi" x=10 y=70
  shape path1 path d="M10 80 L60 80" stroke="black"
  timeline:
    0s: rect1 fadeIn over 0.5s
    0.5s: circle1 fadeIn over 0.5s
    1s: text1 fadeIn over 0.5s
    1.5s: path1 fadeIn over 0.5s
}

```

![Result](assets/examples/features.svg)


## intro.glimma

```glimma
scene demo {
  shape box rect x=10 y=10 width=100 height=50 fill="skyblue"
  shape label text content="Hello" x=20 y=40
  timeline:
    0s: box fadeIn over 1s
    0.5s: label fadeIn over 1s
}

```

![Result](assets/examples/intro.svg)

