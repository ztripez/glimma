import svgPathBbox from 'svg-path-bbox';

// AST Types
interface ASTNode {
  type: 'Document';
  scenes: SceneNode[];
}

interface SceneNode {
  type: 'Scene';
  name: string;
  items: SceneItem[];
}

type SceneItem = ShapeNode | GroupNode | TimelineNode;

interface ShapeNode {
  type: 'Shape';
  id: string;
  shapeType: string;
  attrs: AttributeNode[];
}

interface GroupNode {
  type: 'Group';
  id: string;
  items: SceneItem[];
}

interface TimelineNode {
  type: 'Timeline';
  entries: TimelineEntryNode[];
}

interface TimelineEntryNode {
  type: 'TimelineEntry';
  time: number;
  target: string;
  action: string;
  attrs: AttributeNode[];
  dur: number;
}

interface AttributeNode {
  name: string;
  value: string | number;
}


function getBoundingBox(ast: ASTNode): { minX: number, minY: number, maxX: number, maxY: number } {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  function toPath(item: ShapeNode): string {
    if (item.shapeType === 'rect') {
      const x = parseFloat(item.attrs.find(a => a.name === 'x')?.value as string || '0');
      const y = parseFloat(item.attrs.find(a => a.name === 'y')?.value as string || '0');
      const width = parseFloat(item.attrs.find(a => a.name === 'width')?.value as string || '0');
      const height = parseFloat(item.attrs.find(a => a.name === 'height')?.value as string || '0');
      return `M${x},${y} h${width} v${height} h-${width} Z`;
    }
    if (item.shapeType === 'circle') {
      const cx = parseFloat(item.attrs.find(a => a.name === 'cx')?.value as string || '0');
      const cy = parseFloat(item.attrs.find(a => a.name === 'cy')?.value as string || '0');
      const r = parseFloat(item.attrs.find(a => a.name === 'r')?.value as string || '0');
      return `M${cx - r},${cy} a${r},${r} 0 1,0 ${r * 2},0 a${r},${r} 0 1,0 -${r * 2},0`;
    }
    return item.attrs.find(a => a.name === 'd')?.value as string || '';
  }

  function traverse(items: SceneItem[]) {
    for (const item of items) {
      if (item.type === 'Shape') {
        const path = toPath(item);
        if (path) {
          const [x1, y1, x2, y2] = svgPathBbox(path);
          minX = Math.min(minX, x1);
          minY = Math.min(minY, y1);
          maxX = Math.max(maxX, x2);
          maxY = Math.max(maxY, y2);
        }
      } else if (item.type === 'Group') {
        traverse(item.items);
      }
    }
  }

  for (const scene of ast.scenes) {
    traverse(scene.items);
  }

  return { minX, minY, maxX, maxY };
}

function renderCss(ast: ASTNode, totalDuration: number): string {
  const rules: string[] = [];
  const keyframes = new Map<string, string>();

  const usesFadeIn = ast.scenes.some(s => s.items.some(i => i.type === 'Timeline' && (i as TimelineNode).entries.some(e => e.action === 'fadeIn')));
  const usesFadeOut = ast.scenes.some(s => s.items.some(i => i.type === 'Timeline' && (i as TimelineNode).entries.some(e => e.action === 'fadeOut')));

  if (usesFadeIn) {
    keyframes.set('fadeIn', '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }');
  }
  if (usesFadeOut) {
    keyframes.set('fadeOut', '@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }');
  }

  let animCounter = 0;

  for (const scene of ast.scenes) {
    const timeline = scene.items.find((i): i is TimelineNode => i.type === 'Timeline');
    if (!timeline) continue;

    const targetAnimationGroups = new Map<string, string[]>();
    const targetTransforms = new Map<string, TimelineEntryNode[]>();
    const initialOpacitySet = new Set<string>();

    timeline.entries.sort((a, b) => a.time - b.time);

    for (const entry of timeline.entries) {
      switch (entry.action) {
        case 'fadeIn': {
          const ease = entry.attrs.find(a => a.name === 'ease')?.value || 'ease-in-out';
          if (!initialOpacitySet.has(entry.target)) {
            rules.push(`#${entry.target} { opacity: 0; }`);
            initialOpacitySet.add(entry.target);
          }
          if (!targetAnimationGroups.has(entry.target)) targetAnimationGroups.set(entry.target, []);
          targetAnimationGroups.get(entry.target)!.push(`fadeIn ${entry.dur}s ${ease} ${entry.time}s`);
          break;
        }
        case 'fadeOut': {
          const ease = entry.attrs.find(a => a.name === 'ease')?.value || 'ease-in-out';
          if (!initialOpacitySet.has(entry.target)) {
            rules.push(`#${entry.target} { opacity: 1; }`);
            initialOpacitySet.add(entry.target);
          }
          if (!targetAnimationGroups.has(entry.target)) targetAnimationGroups.set(entry.target, []);
          targetAnimationGroups.get(entry.target)!.push(`fadeOut ${entry.dur}s ${ease} ${entry.time}s`);
          break;
        }
        case 'move':
        case 'rotate':
        case 'scale':
          if (!targetTransforms.has(entry.target)) {
            targetTransforms.set(entry.target, []);
          }
          targetTransforms.get(entry.target)!.push(entry);
          break;
      }
    }

    for (const [target, transforms] of targetTransforms.entries()) {
      const sortedTransforms = transforms.sort((a, b) => a.time - b.time);
      if (sortedTransforms.length === 0) continue;

      const lastTransform = sortedTransforms[sortedTransforms.length - 1];
      const duration = lastTransform.time + lastTransform.dur;
      const animName = `transform-${animCounter++}`;

      const keyframeMap = new Map<number, {transform: string, ease?: string}>();
      keyframeMap.set(0, { transform: 'translate(0px, 0px) rotate(0deg) scale(1, 1)' });

      let tx = 0, ty = 0, rot = 0, sx = 1, sy = 1;

      for (let i = 0; i < sortedTransforms.length; i++) {
        const t = sortedTransforms[i];
        const startTimePercentage = (t.time / duration) * 100;
        const ease = t.attrs.find(a => a.name === 'ease')?.value as string || 'linear';

        const currentTransform = `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${sx}, ${sy})`;
        if (!keyframeMap.has(startTimePercentage)) {
          keyframeMap.set(startTimePercentage, { transform: currentTransform });
        }
        keyframeMap.get(startTimePercentage)!.ease = ease;

        switch (t.action) {
          case 'move':
            tx = Number(t.attrs.find(a => a.name === 'x')?.value) || tx;
            ty = Number(t.attrs.find(a => a.name === 'y')?.value) || ty;
            break;
          case 'rotate':
            rot = Number(t.attrs.find(a => a.name === 'angle')?.value) || rot;
            break;
          case 'scale':
            sx = sy = Number(t.attrs.find(a => a.name === 'factor')?.value) || sx;
            break;
        }

        const nextTransform = `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${sx}, ${sy})`;
        const endTimePercentage = ((t.time + t.dur) / duration) * 100;
        keyframeMap.set(endTimePercentage, { transform: nextTransform });
      }

      let keyframeSteps = '';
      const sortedPercentages = [...keyframeMap.keys()].sort((a, b) => a - b);
      for (let i = 0; i < sortedPercentages.length -1; i++) {
        const p = sortedPercentages[i];
        const { transform, ease } = keyframeMap.get(p)!;
        keyframeSteps += `${p}% { transform: ${transform};`;
        if (ease) {
          keyframeSteps += ` animation-timing-function: ${ease};`;
        }
        keyframeSteps += ' }';
      }
      const lastPercentage = sortedPercentages[sortedPercentages.length - 1];
      keyframeSteps += `${lastPercentage}% { transform: ${keyframeMap.get(lastPercentage)!.transform}; }`;


      keyframes.set(animName, `@keyframes ${animName} { ${keyframeSteps} }`);
      if (!targetAnimationGroups.has(target)) targetAnimationGroups.set(target, []);
      targetAnimationGroups.get(target)!.push(`${animName} ${duration}s linear`);
    }

    for (const [target, animations] of targetAnimationGroups.entries()) {
      rules.push(`#${target} { animation: ${animations.join(', ')}; transform-origin: center; transform-box: fill-box; animation-fill-mode: both; }`);
    }
  }

  return [...keyframes.values(), ...rules].join('\n');
}

export function renderSvg(ast: ASTNode): string {
  const scenes = ast.scenes.map((scene: SceneNode) => renderScene(scene)).join('\n');
  const totalDuration = ast.scenes.reduce((max: number, scene: SceneNode) => {
    const timeline = scene.items.find((i): i is TimelineNode => i.type === 'Timeline');
    if (!timeline) return max;
    const lastEntry = timeline.entries[timeline.entries.length - 1];
    return Math.max(max, lastEntry.time + lastEntry.dur);
  }, 10);
  const css = renderCss(ast, totalDuration);
  const { minX, minY, maxX, maxY } = getBoundingBox(ast);
  const width = maxX - minX;
  const height = maxY - minY;
  const padding = 10;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width + padding * 2}" height="${height + padding * 2}" viewBox="${minX - padding} ${minY - padding} ${width + padding * 2} ${height + padding * 2}">\n<style>\n${css}\n</style>\n${scenes}\n</svg>`;
}

export function renderHtml(ast: ASTNode): string {
  return `<!DOCTYPE html>\n<html><body>\n${renderSvg(ast)}\n</body></html>`;
}

function renderScene(scene: SceneNode): string {
  const items = scene.items
    .filter(item => item.type !== 'Timeline')
    .map(item => renderItem(item))
    .join('\n');
  return `<g id="${scene.name}">\n${items}\n</g>`;
}

function renderItem(item: SceneItem): string {
  if (item.type === 'Shape') {
    const attrs = item.attrs.map(a => `${a.name}="${a.value}"`).join(' ');
    if (item.shapeType === 'rect' || item.shapeType === 'circle' || item.shapeType === 'path') {
      return `<${item.shapeType} id="${item.id}" ${attrs} />`;
    }
    if (item.shapeType === 'text') {
      const content = item.attrs.find(a => a.name === 'content')?.value || '';
      return `<text id="${item.id}" ${attrs}>${content}</text>`;
    }
  } else if (item.type === 'Group') {
    const children = item.items.map(c => renderItem(c)).join('\n');
    return `<g id="${item.id}">\n${children}\n</g>`;
  }
  return '';
}
