# GitHub Copilot Instructions

## Project Overview

This is a monorepo SaaS application built with **Cloudflare Workers**, **TanStack Start**, and **Drizzle ORM**.

- **Package Manager**: `pnpm`
- **Database**: Cloudflare D1 (SQLite)
- **Authentication**: Better Auth
- **Styling**: Tailwind CSS v4

## Repository Structure

- `apps/user-application`: Frontend/Fullstack app (TanStack Start, React 19, Vite).
- `apps/data-service`: Backend API Worker (Hono).
- `packages/data-ops`: Shared library for Database (Drizzle) and Authentication (Better Auth).

## Critical Developer Workflows

### 1. Setup & Development

- **Initial Setup**: `pnpm run setup` (Installs deps & builds `data-ops`).
- **Start User App**: `pnpm run dev:user-application` (Runs on port 3000).
- **Start Data Service**: `pnpm run dev:data-service`.
- **Rebuild Shared Lib**: `pnpm run build:data-ops` (Run this after changing `packages/data-ops`).

### 2. Database & Authentication (Cloudflare D1)

The `data-ops` package manages the database schema and auth configuration.

- **Generate Auth Schema**: `pnpm run --filter data-ops better-auth:generate`
- **Generate SQL Migrations**: `pnpm run --filter data-ops drizzle:generate`
- **Apply Migrations (Local)**: `npx wrangler d1 execute DB --local --file=../../packages/data-ops/src/drizzle/<migration_file>.sql` (from `apps/user-application`)
- **Apply Migrations (Remote)**: `pnpm run --filter data-ops drizzle:migrate`

### 3. Type Generation

- **Generate Worker Types**: `pnpm run --filter user-application cf-typegen`
  - Updates `worker-configuration.d.ts` based on `wrangler.jsonc`.
  - Run this after modifying bindings or environment variables.

## Architecture & Patterns

### Environment Variables & Bindings

- **Pattern**: Use `import { env } from "cloudflare:workers"` to access bindings globally.
- **Local Secrets**: Store in `apps/user-application/.dev.vars`.
- **Drizzle Kit Secrets**: Store in `packages/data-ops/.env` (for schema generation only).
- **Wrangler Config**: Defined in `wrangler.jsonc` (supports comments).

### Shared Data Operations (`packages/data-ops`)

- Centralizes all DB schemas (`src/drizzle/auth-schema.ts`) and setup (`src/database/setup.ts`).
- Exports helper functions like `initDatabase` and `setAuth`.
- **Rule**: Do not define DB schemas in apps; always define in `data-ops` and import.

### User Application (`apps/user-application`)

- **Framework**: TanStack Start (SSR, File-based routing).
- **Entry Point**: `src/server.ts` (Custom Cloudflare Worker entry).
- **Routing**: `src/routes/` (Auto-generated `routeTree.gen.ts`).
- **Styling**: Tailwind v4 (no `tailwind.config.js`, uses CSS variables).

## Task Management (Mandatory)

This project uses **bd** (beads) for issue tracking.

- **Start Work**: `bd update <id> --status in_progress`
- **Finish Work**: `bd close <id>`
- **Sync**: `bd sync` (Run before pushing)
- **End Session**: Ensure `git push` succeeds.

## Coding Standards

- **TypeScript**: Strict mode enabled. Use `import type` for type-only imports.
- **React**: Use Functional Components with Hooks.
- **Imports**: Use `@/*` aliases for `src/*`.
- **Files**: Kebab-case for filenames (e.g., `user-profile.tsx`).
