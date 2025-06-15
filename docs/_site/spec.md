# Glimma DSL Specification

This document defines the syntax and semantics of the Glimma animation language.
Refer to the project README for the high level overview.

## Overview

Glimma is a declarative language for creating SVG animations. A `.glimma` file contains one or more **scenes**, each defining **shapes**, **groups**, and **timelines** that orchestrate animations.

## Basic Structure

```glimma
scene SceneName {
  shape shapeId shapeType attr1=value1 attr2=value2
  group groupId {
    shape nestedShape rect x=10 y=10
  }
  timeline:
    0s: shapeId fadeIn over 2s
    1s: groupId move x=100 over 1.5s
}
```

## Scenes

A scene is the top-level container for an animation. Each scene generates a separate animation output.

```glimma
scene demo {
  // shapes, groups, timeline
}
```

- **Name**: Must be a valid identifier (`[a-zA-Z_][a-zA-Z0-9_-]*`)
- **Content**: Shapes, groups, and timeline definitions

## Shapes

Shapes define visual elements that can be animated.

```glimma
shape shapeId shapeType attribute=value
```

### Shape Types

#### Rectangle (`rect`)
```glimma
shape box rect x=10 y=10 width=100 height=50 fill="blue"
```
- `x`, `y`: Position coordinates
- `width`, `height`: Dimensions
- `fill`: Fill color (hex, named colors, or quoted strings)

#### Circle (`circle`)
```glimma
shape dot circle cx=50 cy=50 r=20 fill="#ff0000"
```
- `cx`, `cy`: Center coordinates
- `r`: Radius
- `fill`: Fill color

#### Text (`text`)
```glimma
shape label text content="Hello World" x=10 y=30
```
- `content`: Text content (quoted string)
- `x`, `y`: Position coordinates
- Additional styling attributes supported

#### Path (`path`)
```glimma
shape line path d="M10 80 L60 80" stroke="black"
```
- `d`: SVG path data
- `stroke`: Stroke color
- `fill`: Fill color (optional)

### Common Attributes

All shapes support:
- `fill`: Fill color
- `stroke`: Stroke color  
- `opacity`: Transparency (0-1)
- Position attributes (`x`, `y`, `cx`, `cy`)
- Dimension attributes (`width`, `height`, `r`)

## Groups

Groups allow hierarchical organization of shapes for collective animation.

```glimma
group groupId {
  shape child1 rect x=0 y=0 width=20 height=20
  shape child2 circle cx=30 cy=10 r=5
  group nestedGroup {
    shape grandchild text content="nested" x=0 y=40
  }
}
```

- Groups can contain shapes and other groups
- Groups can be animated as a unit
- Child elements inherit group transformations

## Timeline

The timeline defines when and how animations occur.

```glimma
timeline:
  0s: target action over duration
  1.5s: target action attribute=value over duration
```

### Timeline Entry Format

```glimma
timeInSeconds: targetId actionType [attributes] over durationInSeconds
```

- **Time**: Start time in seconds (decimal supported)
- **Target**: Shape or group ID to animate
- **Action**: Animation type
- **Attributes**: Action-specific parameters
- **Duration**: Animation duration via `over Ns` clause

### Animation Actions

#### `fadeIn`
```glimma
0s: box fadeIn over 2s
```
Animates opacity from 0 to 1.

#### `fadeOut`  
```glimma
2s: box fadeOut over 1s
```
Animates opacity from current value to 0.

#### `move`
```glimma
1s: box move x=200 over 1.5s
```
Translates element to new position.
- `x`, `y`: Target coordinates

#### `rotate`
```glimma
2s: box rotate angle=45 over 2s
```
Rotates element around its center.
- `angle`: Rotation in degrees

#### `scale`
```glimma
1s: circle scale factor=1.5 over 2s
```
Scales element size.
- `factor`: Scale multiplier

## Comments

Comments start with `#` and continue to end of line:

```glimma
# This is a comment
scene demo {
  shape box rect x=10 y=10  # inline comment
}
```

## Value Types

### Numbers
- Integers: `42`, `-10`
- Decimals: `3.14`, `-0.5`

### Strings
- Quoted: `"Hello World"`
- Unquoted identifiers: `skyblue`, `red`

### Identifiers
- Pattern: `[a-zA-Z_][a-zA-Z0-9_-]*`
- Examples: `box`, `main_shape`, `button-1`

## Example

```glimma
scene intro {
  shape background rect x=0 y=0 width=400 height=300 fill="#f0f0f0"
  shape title text content="Welcome" x=50 y=50
  
  group controls {
    shape button rect x=50 y=100 width=80 height=30 fill="blue"
    shape buttonText text content="Click" x=70 y=120 fill="white"
  }
  
  timeline:
    0s: background fadeIn over 0.5s
    0.5s: title fadeIn over 1s
    1.5s: controls fadeIn over 0.8s
    3s: controls move x=200 over 2s
    5s: title fadeOut over 1s
}
```
