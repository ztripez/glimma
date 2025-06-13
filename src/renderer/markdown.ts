export interface ExampleData {
  filename: string;
  comments: string;
  code: string;
  svgFile: string;
}

export function renderExample(data: ExampleData): string {
  return `
## ${data.filename}

${data.comments}

\`\`\`glimma
${data.code}
\`\`\`

![Result](/assets/examples/${data.svgFile})
`;
}