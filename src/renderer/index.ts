import svgPathBbox from 'svg-path-bbox';

function getBoundingBox(ast: ASTNode): { minX: number, minY: number, maxX: number, maxY: number } {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  function toPath(item: any): string {
    if (item.shapeType === 'rect') {
      const x = parseFloat(item.attrs.find((a: any) => a.name === 'x')?.value || 0);
      const y = parseFloat(item.attrs.find((a: any) => a.name === 'y')?.value || 0);
      const width = parseFloat(item.attrs.find((a: any) => a.name === 'width')?.value || 0);
      const height = parseFloat(item.attrs.find((a: any) => a.name === 'height')?.value || 0);
      return `M${x},${y} h${width} v${height} h-${width} Z`;
    }
    if (item.shapeType === 'circle') {
      const cx = parseFloat(item.attrs.find((a: any) => a.name === 'cx')?.value || 0);
      const cy = parseFloat(item.attrs.find((a: any) => a.name === 'cy')?.value || 0);
      const r = parseFloat(item.attrs.find((a: any) => a.name === 'r')?.value || 0);
      return `M${cx - r},${cy} a${r},${r} 0 1,0 ${r * 2},0 a${r},${r} 0 1,0 -${r * 2},0`;
    }
    return item.attrs.find((a: any) => a.name === 'd')?.value || '';
  }

  function traverse(items: any[]) {
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
  let usesFade = false;
  for (const scene of ast.scenes) {
    const timeline = scene.items.find((i: any) => i.type === 'Timeline');
    if (!timeline) continue;
    for (const entry of timeline.entries) {
      if (entry.action === 'fadeIn') {
        usesFade = true;
        rules.push(`#${entry.target} { opacity: 0; animation: fadeIn ${entry.dur}s ease-in-out ${entry.time}s infinite; }`);
      } else if (entry.action === 'fadeOut') {
        usesFade = true;
        rules.push(`#${entry.target} { opacity: 1; animation: fadeOut ${entry.dur}s ease-in-out ${entry.time}s infinite; }`);
      }
    }
  }
  if (usesFade) {
    rules.unshift(`@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }`);
    rules.unshift(`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`);
  }
  return rules.join('\n');
}

export function renderSvg(ast: ASTNode): string {
  const scenes = ast.scenes.map((scene: any) => renderScene(scene)).join('\n');
  const totalDuration = ast.scenes.reduce((max: number, scene: any) => {
    const timeline = scene.items.find((i: any) => i.type === 'Timeline');
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

function renderScene(scene: any): string {
  const items = scene.items
    .filter((item: any) => item.type !== 'Timeline')
    .map((item: any) => renderItem(item))
    .join('\n');
  return `<g id="${scene.name}">\n${items}\n</g>`;
}

function renderItem(item: any): string {
  if (item.type === 'Shape') {
    const attrs = item.attrs.map((a: any) => `${a.name}="${a.value}"`).join(' ');
    if (item.shapeType === 'rect' || item.shapeType === 'circle' || item.shapeType === 'path') {
      return `<${item.shapeType} id="${item.id}" ${attrs} />`;
    }
    if (item.shapeType === 'text') {
      const content = item.attrs.find((a: any) => a.name === 'content')?.value || '';
      return `<text id="${item.id}" ${attrs}>${content}</text>`;
    }
  } else if (item.type === 'Group') {
    const children = item.items.map((c: any) => renderItem(c)).join('\n');
    return `<g id="${item.id}">\n${children}\n</g>`;
  }
  return '';
}
