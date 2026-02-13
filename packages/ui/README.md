# packages/ui

This package contains shared UI components for RentShortlet.

## Install & Usage

This is a workspace package consumed by apps in this monorepo.

- Import components:

  ```ts
  import { Button } from '@workspace/ui/components/button';
  ```

- Import global styles (Tailwind v4 + tokens):

  ```ts
  import '@workspace/ui/globals.css';
  ```

## Scripts

From `packages/ui`:

- Test: `pnpm run test`
- Lint: `pnpm run lint`
- Typecheck: `pnpm tsc -p tsconfig.json --noEmit`
- Format: `pnpm run format`

## Design Tokens

- Tokens live in `src/styles/globals.css` (OKLCH palette + light/dark semantic mapping).
- If you change token values, run the contrast checker:

  ```bash
  pnpm run contrast:check
  pnpm run contrast:check -- --verbose
  pnpm run contrast:check -- --strict
  ```

The checker validates:

- Text contrast at 4.5:1
- Non-text UI contrast (borders/rings) at 3:1

## Docs

- Design tokens: `docs/design-tokens.md`
- Hooks: `docs/hooks.md`
- Components: `docs/components.md`
- API reference (generated): `docs/api.md`

## Generating Components (shadcn)

Shadcn components are generated into `src/components` using the `shadcn` CLI.

Quick start:

- Generate new components:

  ```bash
  cd packages/ui
  pnpm dlx shadcn@latest add <component-name>
  ```

  Shadcn covers the following ui components: accordion alert aspect-ratio avatar badge breadcrumb button button-group calendar card carousel chart checkbox collapsible combobox command context-menu data-table date-picker dialog drawer dropdown-menu empty-field form hover-card input input-group input-otp input-item kbd label menubar navigation-menu native-select pagination popover progress radio-group resizable scroll-area select separator sheet sidebar skeleton slider sonner spinner switch table tabs textarea toast toggle toggle-group tooltip typography

- Typecheck the package:

  ```bash
  pnpm tsc -p tsconfig.json --noEmit
  ```

- Notes:
  - The `toast` component is deprecated in the shadcn registry; `sonner` is used instead.
  - Generated components follow the `base-nova` style variant configured in `components.json`.
