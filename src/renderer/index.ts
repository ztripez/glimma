import type { ASTNode } from '../parser/index.js';

export function renderSvg(ast: ASTNode): string {
  const scenes = ast.scenes.map((scene: any) => renderScene(scene)).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg">\n${scenes}\n</svg>`;
}

export function renderHtml(ast: ASTNode): string {
  return `<!DOCTYPE html>\n<html><body>\n${renderSvg(ast)}\n</body></html>`;
}

function renderScene(scene: any): string {
  const items = scene.items.map((item: any) => renderItem(item)).join('\n');
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
  }
  return '';
}
