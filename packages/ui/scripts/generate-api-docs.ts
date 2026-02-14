import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

type ExportInfo = {
  exportPath: string;
  sourceFile: string;
  symbols: string[];
};

const EXPORT_KINDS = ['function', 'const', 'class', 'type', 'interface'] as const;

function isTsFile(name: string) {
  return name.endsWith('.ts') || name.endsWith('.tsx');
}

function stripExt(fileName: string) {
  return fileName.replace(/\.(ts|tsx)$/, '');
}

function uniqSorted(list: string[]) {
  return [...new Set(list)].sort((a, b) => a.localeCompare(b));
}

function extractSymbols(code: string): string[] {
  const symbols: string[] = [];

  for (const kind of EXPORT_KINDS) {
    const re = new RegExp(`\\bexport\\s+${kind}\\s+([A-Za-z0-9_]+)`, 'g');
    for (const match of code.matchAll(re)) {
      const name = match[1];
      if (name) symbols.push(name);
    }
  }

  // export { A, B as C, type D }
  for (const match of code.matchAll(/\bexport\s*\{([^}]+)\}/g)) {
    const raw = match[1] ?? '';
    const parts = raw
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => p.replace(/^type\s+/, ''))
      .map((p) => (p.split(/\s+as\s+/i)[0] ?? '').trim())
      .filter(Boolean);

    for (const p of parts) symbols.push(p);
  }

  return uniqSorted(symbols);
}

async function gatherExports(kind: 'components' | 'hooks') {
  const baseDir = resolve(process.cwd(), 'src', kind);
  const files = (await readdir(baseDir)).filter(isTsFile);

  const exports: ExportInfo[] = [];

  for (const file of files) {
    const sourceFile = `src/${kind}/${file}`;
    const exportPath = `@workspace/ui/${kind}/${stripExt(file)}`;
    const code = await readFile(resolve(process.cwd(), sourceFile), 'utf8');
    const symbols = extractSymbols(code);

    exports.push({ exportPath, sourceFile, symbols });
  }

  return exports.sort((a, b) => a.exportPath.localeCompare(b.exportPath));
}

function renderTable(items: ExportInfo[]) {
  const lines: string[] = [];
  lines.push('| Import path | Source | Exports |');
  lines.push('|---|---|---|');

  for (const item of items) {
    const symbols = item.symbols.length
      ? item.symbols.map((s) => `\`${s}\``).join(', ')
      : '(module exports)';
    lines.push(`| \`${item.exportPath}\` | \`${item.sourceFile}\` | ${symbols} |`);
  }

  return lines.join('\n');
}

async function main() {
  const components = await gatherExports('components');
  const hooks = await gatherExports('hooks');

  const outPath = resolve(process.cwd(), 'docs', 'api.md');

  const md = `# API Reference\n\nThis page is generated from the source files in \`src/components\` and \`src/hooks\`.\n\n- Regenerate: \`pnpm run api:generate\`\n- Strictness note: this is a lightweight extractor (not a full TS parser).\n\n## Components\n\n${renderTable(components)}\n\n## Hooks\n\n${renderTable(hooks)}\n`;

  await writeFile(outPath, md, 'utf8');

  console.log(`Wrote ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
