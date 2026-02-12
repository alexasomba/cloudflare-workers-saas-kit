# GEMINI.md - Cloudflare Workers SaaS Kit

## Project Overview

This project is a high-performance, full-stack monorepo SaaS kit built for the Cloudflare ecosystem. It leverages **TanStack Start** for a modern React frontend and **Hono** for a lightweight data service backend, all powered by **Cloudflare Workers**, **D1 (SQLite)**, and **Drizzle ORM**.

- **Frontend**: TanStack Start (React 19, SSR, File-based routing)
- **Backend API**: Data Service (Hono Worker)
- **Database**: Cloudflare D1 managed via Drizzle ORM
- **Authentication**: Better Auth (configured in `packages/data-ops`)
- **Monorepo Tooling**: PNPM Workspaces, NX (build orchestration)
- **Styling**: Tailwind CSS v4

## Repository Structure

- `apps/user-application`: Main full-stack application (TanStack Start).
- `apps/data-service`: Backend API worker (Hono) for specialized data tasks.
- `packages/data-ops`: Core library managing Drizzle schemas, migrations, and Better Auth configuration.
- `packages/ui`: Shared UI component library using Tailwind v4 and Base UI.
- `packages/eslint-config` & `packages/typescript-config`: Shared developer tool configurations.

## Building and Running

### Initial Setup

```bash
bun run setup
```

This installs dependencies and performs an initial build of the `@repo/data-ops` package.

### Development

- **Start User Application**: `bun run dev:user-application` (Port 3000)
- **Start Data Service**: `bun run dev:data-service` (Port 8787)

### Common Tasks

- **Build Shared Ops**: `bun run build:data-ops` (Required after changing schemas/auth)
- **Type Generation**: `bun run --filter ./apps/user-application cf-typegen`
- **Lint All**: `bun run lint`
- **Typecheck All**: `bun run typecheck`

## Development Conventions

### Coding Standards

- **TypeScript**: Strict mode. Use `import type` for type-only imports.
- **Naming**: Use **kebab-case** for all filenames (e.g., `user-profile-table.tsx`).
- **Components**: Functional components with React Hooks. Prefer Base UI composition patterns.
- **Imports**: Use `@/*` for application-local source and `@workspace/ui/*` for shared components.

### Data & Auth Guidelines

- **Schema Location**: NEVER define Drizzle schemas in apps. Define them in `packages/data-ops/src/drizzle` and export/import them.
- **Bindings**: Access Cloudflare bindings globally using `import { env } from "cloudflare:workers"`.
- **Database Init**: Use the custom server entry in `apps/user-application/src/server.ts` to initialize database and auth on every request.

### Database Migrations (Local)

To apply migrations locally during development:

```bash
npx wrangler d1 execute DB --local --file=../../packages/data-ops/src/drizzle/<migration_file>.sql
```

_(Run from within `apps/user-application`)_

## 🚨 Session Close Protocol

Before completing any task or ending a session, you MUST:

1. **Run Quality Gates**: Verify with `lint`, `typecheck`, or `build` as needed.
2. **Git Workflow**:
   ```bash
   git status
   git add .
   git commit -m "feat/fix: describe changes"
   git pull --rebase
   git push
   ```
3. **Verify**: Ensure `git status` shows the local branch is up-to-date with origin.
