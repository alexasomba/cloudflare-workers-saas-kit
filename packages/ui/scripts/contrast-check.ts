import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parse, wcagContrast } from 'culori';

type Theme = 'light' | 'dark';

type Check = {
  name: string;
  fg: string;
  bg: string;
  minRatio: number;
  required?: boolean;
};

type ResolvedCheck = {
  fgValue?: string;
  bgValue?: string;
  ratio?: number;
};

function extractBlock(css: string, selector: string): string {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) {
    throw new Error(`Could not find CSS block for selector: ${selector}`);
  }

  const braceStart = css.indexOf('{', start);
  let depth = 0;
  for (let i = braceStart; i < css.length; i++) {
    const char = css[i];
    if (char === '{') depth++;
    if (char === '}') {
      depth--;
      if (depth === 0) {
        return css.slice(braceStart + 1, i);
      }
    }
  }

  throw new Error(`Unterminated CSS block for selector: ${selector}`);
}

function parseVars(block: string): Map<string, string> {
  const vars = new Map<string, string>();
  const lines = block.split('\n');
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line.startsWith('--')) continue;
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const name = line.slice(0, colonIndex).trim();
    const value = line
      .slice(colonIndex + 1)
      .trim()
      .replace(/;\s*$/, '');

    if (name) vars.set(name, value);
  }
  return vars;
}

function resolveVar(
  vars: Map<string, string>,
  name: string,
  seen = new Set<string>()
): string | undefined {
  if (seen.has(name)) return undefined;
  seen.add(name);

  const value = vars.get(name);
  if (!value) return undefined;

  const varMatch = value.match(/^var\((--[a-zA-Z0-9-_]+)\)$/);
  if (varMatch) {
    const ref = varMatch[1];
    if (!ref) return undefined;
    return resolveVar(vars, ref, seen);
  }

  return value;
}

function resolveFor(vars: Map<string, string>, fgVar: string, bgVar: string): ResolvedCheck {
  const fgValue = resolveVar(vars, fgVar);
  const bgValue = resolveVar(vars, bgVar);
  if (!fgValue || !bgValue) return { fgValue, bgValue };

  const fg = parse(fgValue);
  const bg = parse(bgValue);
  if (!fg || !bg) return { fgValue, bgValue };

  return { fgValue, bgValue, ratio: wcagContrast(fg, bg) };
}

function hasFlag(name: string) {
  return process.argv.includes(name);
}

async function main() {
  const verbose = hasFlag('--verbose') || hasFlag('-v');
  const strict = hasFlag('--strict');

  const globalsPath = resolve(process.cwd(), 'src/styles/globals.css');
  const css = await readFile(globalsPath, 'utf8');

  const rootBlock = extractBlock(css, ':root');
  const darkBlock = extractBlock(css, '.dark');

  const rootVars = parseVars(rootBlock);
  const darkVars = new Map(rootVars);
  for (const [key, value] of parseVars(darkBlock)) {
    darkVars.set(key, value);
  }

  const textChecks: Array<Check> = [
    { name: 'Foreground on Background', fg: '--foreground', bg: '--background', minRatio: 4.5 },
    { name: 'Foreground on Card', fg: '--foreground', bg: '--card', minRatio: 4.5 },
    { name: 'Foreground on Popover', fg: '--foreground', bg: '--popover', minRatio: 4.5 },
    { name: 'Foreground on Muted', fg: '--foreground', bg: '--muted', minRatio: 4.5 },
    { name: 'Foreground on Secondary', fg: '--foreground', bg: '--secondary', minRatio: 4.5 },
    { name: 'Foreground on Accent', fg: '--foreground', bg: '--accent', minRatio: 4.5 },
    {
      name: 'Sidebar foreground on Sidebar',
      fg: '--sidebar-foreground',
      bg: '--sidebar',
      minRatio: 4.5,
    },

    {
      name: 'Muted foreground on Background',
      fg: '--muted-foreground',
      bg: '--background',
      minRatio: 4.5,
    },
    { name: 'Muted foreground on Card', fg: '--muted-foreground', bg: '--card', minRatio: 4.5 },
    {
      name: 'Muted foreground on Popover',
      fg: '--muted-foreground',
      bg: '--popover',
      minRatio: 4.5,
    },
    { name: 'Muted foreground on Muted', fg: '--muted-foreground', bg: '--muted', minRatio: 4.5 },
    {
      name: 'Muted foreground on Sidebar',
      fg: '--muted-foreground',
      bg: '--sidebar',
      minRatio: 4.5,
    },

    // Advisory: in many systems these tokens are primarily used as backgrounds, not text colors.
    {
      name: 'Primary as text on Background',
      fg: '--primary',
      bg: '--background',
      minRatio: 4.5,
      required: false,
    },
    {
      name: 'Primary as text on Card',
      fg: '--primary',
      bg: '--card',
      minRatio: 4.5,
      required: false,
    },
    {
      name: 'Destructive as text on Background',
      fg: '--destructive',
      bg: '--background',
      minRatio: 4.5,
      required: false,
    },
    {
      name: 'Success as text on Background',
      fg: '--success',
      bg: '--background',
      minRatio: 4.5,
      required: false,
    },
    {
      name: 'Warning as text on Background',
      fg: '--warning',
      bg: '--background',
      minRatio: 4.5,
      required: false,
    },

    { name: 'Card foreground on Card', fg: '--card-foreground', bg: '--card', minRatio: 4.5 },
    {
      name: 'Popover foreground on Popover',
      fg: '--popover-foreground',
      bg: '--popover',
      minRatio: 4.5,
    },
    {
      name: 'Primary foreground on Primary',
      fg: '--primary-foreground',
      bg: '--primary',
      minRatio: 4.5,
    },
    {
      name: 'Secondary foreground on Secondary',
      fg: '--secondary-foreground',
      bg: '--secondary',
      minRatio: 4.5,
    },
    {
      name: 'Accent foreground on Accent',
      fg: '--accent-foreground',
      bg: '--accent',
      minRatio: 4.5,
    },
    {
      name: 'Destructive foreground on Destructive',
      fg: '--destructive-foreground',
      bg: '--destructive',
      minRatio: 4.5,
    },
    {
      name: 'Success foreground on Success',
      fg: '--success-foreground',
      bg: '--success',
      minRatio: 4.5,
    },
    {
      name: 'Warning foreground on Warning',
      fg: '--warning-foreground',
      bg: '--warning',
      minRatio: 4.5,
    },
    {
      name: 'Sidebar primary foreground on Sidebar primary',
      fg: '--sidebar-primary-foreground',
      bg: '--sidebar-primary',
      minRatio: 4.5,
    },
  ];

  // Non-text contrast (WCAG 1.4.11): focus rings, borders, etc. Target 3:1.
  const nonTextChecks: Array<Check> = [
    { name: 'Border on Background', fg: '--border', bg: '--background', minRatio: 3.0 },
    { name: 'Border on Card', fg: '--border', bg: '--card', minRatio: 3.0 },
    { name: 'Input on Background', fg: '--input', bg: '--background', minRatio: 3.0 },
    { name: 'Input on Card', fg: '--input', bg: '--card', minRatio: 3.0 },
    { name: 'Ring on Background', fg: '--ring', bg: '--background', minRatio: 3.0 },
    { name: 'Ring on Card', fg: '--ring', bg: '--card', minRatio: 3.0 },
    { name: 'Sidebar border on Sidebar', fg: '--sidebar-border', bg: '--sidebar', minRatio: 3.0 },
    { name: 'Sidebar ring on Sidebar', fg: '--sidebar-ring', bg: '--sidebar', minRatio: 3.0 },
  ];

  const themes: Array<[Theme, Map<string, string>]> = [
    ['light', rootVars],
    ['dark', darkVars],
  ];

  let failed = 0;

  for (const [themeName, vars] of themes) {
    console.log(`\nTheme: ${themeName}`);

    console.log('\nText (min 4.5)');

    for (const check of textChecks) {
      const resolved = resolveFor(vars, check.fg, check.bg);
      const ratio = resolved.ratio;
      if (ratio == null || Number.isNaN(ratio)) {
        failed++;
        console.log(`- ${check.name}: ERROR (could not compute)`);
        if (verbose) {
          console.log(`  fg=${check.fg} -> ${resolved.fgValue ?? '<missing>'}`);
          console.log(`  bg=${check.bg} -> ${resolved.bgValue ?? '<missing>'}`);
        }
        continue;
      }

      const ok = ratio >= check.minRatio;
      const required = check.required ?? true;
      if (!ok && (strict || required)) failed++;

      const status = ok ? 'OK' : required ? 'FAIL' : 'WARN';
      console.log(`- ${check.name}: ${ratio.toFixed(2)} (min ${check.minRatio}) ${status}`);
      if (verbose && !ok) {
        console.log(`  fg=${check.fg} -> ${resolved.fgValue}`);
        console.log(`  bg=${check.bg} -> ${resolved.bgValue}`);
      }
    }

    console.log('\nNon-text (min 3.0)');

    for (const check of nonTextChecks) {
      const resolved = resolveFor(vars, check.fg, check.bg);
      const ratio = resolved.ratio;
      if (ratio == null || Number.isNaN(ratio)) {
        failed++;
        console.log(`- ${check.name}: ERROR (could not compute)`);
        if (verbose) {
          console.log(`  fg=${check.fg} -> ${resolved.fgValue ?? '<missing>'}`);
          console.log(`  bg=${check.bg} -> ${resolved.bgValue ?? '<missing>'}`);
        }
        continue;
      }

      const ok = ratio >= check.minRatio;
      const required = check.required ?? true;
      if (!ok && (strict || required)) failed++;

      const status = ok ? 'OK' : required ? 'FAIL' : 'WARN';
      console.log(`- ${check.name}: ${ratio.toFixed(2)} (min ${check.minRatio}) ${status}`);
      if (verbose && !ok) {
        console.log(`  fg=${check.fg} -> ${resolved.fgValue}`);
        console.log(`  bg=${check.bg} -> ${resolved.bgValue}`);
      }
    }
  }

  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
