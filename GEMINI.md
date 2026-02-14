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
pnpm run setup
```

This installs dependencies and performs an initial build of the `@repo/data-ops` package.

### Development

- **Start User Application**: `pnpm run dev:user-application` (Port 3000)
- **Start Data Service**: `pnpm run dev:data-service` (Port 8787)

### Common Tasks

- **Build Shared Ops**: `pnpm run build:data-ops` (Required after changing schemas/auth)
- **Type Generation**: `pnpm run --filter user-application cf-typegen`
- **Lint All**: `pnpm run lint`
- **Typecheck All**: `pnpm run typecheck`
- **Test All**: `npx nx run-many -t test`

## Development Workflow

This project follows a **Test-Driven Development (TDD)** workflow. Every feature or fix must begin with a test case that defines the expected behavior before implementation starts.

1.  **Research & Context**: Always use `codebase_investigator` to understand existing patterns and perform **Web Search** for up-to-date documentation on external libraries (Cloudflare, TanStack, etc.).
2.  **Test First**: Write a failing test that captures the requirement.
3.  **Implementation**: Write the minimum code necessary to pass the test.
4.  **Verification**: After every change, execute the quality gates:
    - `pnpm run typecheck`
    - `pnpm run lint`
    - `npx nx run-many -t test` (vitest)

## Development Conventions

### Architecture & State Strategy

- **Server Functions vs. Data Service**:
  - Use **TanStack Start Server Functions** for UI-specific data fetching, mutations, and logic tightly coupled to a route.
  - Use the **Data Service (Hono)** for complex data processing, external integrations, or APIs that need to be accessible across multiple applications.
- **State Management**:
  - **TanStack Query**: Use for all server state (fetching, caching, synchronization).
  - **TanStack Store**: Use for transient, client-side UI state that doesn't persist across sessions.

### AI & LLM Integration

- **Tooling**: Use `@tanstack/ai` for integrating LLMs.
- **Streaming**: Prefer streaming responses for AI chat features to improve perceived performance.
- **Patterns**: Define AI system prompts and model configurations in a centralized utility within the application to ensure consistency.

### Coding Standards

- **TypeScript**: Strict mode. Use `import type` for type-only imports.
- **Naming**: Use **kebab-case** for all filenames (e.g., `user-profile-table.tsx`).
- **Components**: Functional components with React Hooks. Prefer Base UI composition patterns.
- **Styling**: Use **Tailwind CSS v4**. Prefer utility-first classes directly in components. Avoid `@apply` in CSS files unless absolutely necessary for third-party overrides.
- **Imports**: Use `@/*` for application-local source and `@workspace/ui/*` for shared components.

### Data & Auth Guidelines

- **Schema Location**: NEVER define Drizzle schemas in apps. Define them in `packages/data-ops/src/drizzle` and export/import them.
- **Schema Change Loop**: When modifying database schemas:
  1. Update schema in `packages/data-ops`.
  2. Run `pnpm run build:data-ops`.
  3. Update application code to reflect changes.
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
