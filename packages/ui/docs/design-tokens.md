# Design Tokens

Tokens live in `src/styles/globals.css`.

## Structure

- **Palette tokens**: `--primary-*`, `--neutral-*` (OKLCH).
- **Semantic tokens**: `--background`, `--foreground`, `--muted`, `--muted-foreground`, etc.
- **Theme mapping**:
  - `:root { ... }` = light theme
  - `.dark { ... }` = dark theme overrides

## Tailwind v4 mapping

The file uses `@theme inline` to expose semantic variables as Tailwind colors:

- `--color-background: var(--background)`
- `--color-foreground: var(--foreground)`
- …and so on.

This enables classes like `bg-background`, `text-foreground`, `text-muted-foreground`, etc.

## Contrast verification

Run:

```bash
cd packages/ui
bun run contrast:check
bun run contrast:check -- --verbose
bun run contrast:check -- --strict
```

- **Text** checks target **4.5:1**.
- **Non-text UI** checks (borders/rings) target **3:1**.

If you intentionally use a semantic token as a _text color_ on a given surface, prefer enabling `--strict` in CI or locally.
