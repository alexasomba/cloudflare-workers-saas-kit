declare module 'culori' {
  export function parse(input: string): unknown;
  export function wcagContrast(foreground: unknown, background: unknown): number;
}
