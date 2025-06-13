import type { ASTNode } from '../parser/index.js';

function renderCss(ast: ASTNode): string {
  const rules: string[] = [];
  let usesFade = false;
  for (const scene of ast.scenes) {
    const timeline = scene.items.find((i: any) => i.type === 'Timeline');
    if (!timeline) continue;
    for (const entry of timeline.entries) {
      if (entry.action === 'fadeIn') {
        usesFade = true;
        rules.push(`#${entry.target} { opacity: 0; animation: fadeIn ${entry.dur}s ease-in-out ${entry.time}s forwards; }`);
      } else if (entry.action === 'fadeOut') {
        usesFade = true;
        rules.push(`#${entry.target} { opacity: 1; animation: fadeOut ${entry.dur}s ease-in-out ${entry.time}s forwards; }`);
      }
    }
  }
  if (usesFade) {
    rules.unshift('@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }');
    rules.unshift('@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }');
  }
  return rules.join('\n');
}

export function renderSvg(ast: ASTNode): string {
  const scenes = ast.scenes.map((scene: any) => renderScene(scene)).join('\n');
  const css = renderCss(ast);
  return `<svg xmlns="http://www.w3.org/2000/svg">\n<style>\n${css}\n</style>\n${scenes}\n</svg>`;
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
