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

### Architecture & TanStack Ecosystem Strategy

- **TanStack Start**: The primary full-stack framework. Use **Server Functions** for UI-specific data fetching and mutations.
- **TanStack Router**: File-based, type-safe routing. Use `createFileRoute` for all routes and leverage **Loaders** for pre-fetching data.
- **TanStack Query**: The "Server State" engine. Use for caching, synchronization with D1, and managing all async operations.
- **TanStack DB (Local-First)**: Use for features requiring offline capabilities. D1 is the "Source of Truth."
- **TanStack Form**: Use for all form management with Zod validation.
- **TanStack Table**: Use for data-heavy views.
- **TanStack AI**: Orchestrate LLM integrations. Prefer **Streaming** responses.
- **TanStack Store**: Use for global **transient** UI state only.

### Cloudflare Services Strategy

Maximize the Cloudflare ecosystem by choosing the right tool for the job:

- **D1 (SQL Database)**: Primary relational storage. Managed via **Drizzle ORM** in `packages/data-ops`.
- **KV (Key-Value)**: Use for high-read, low-latency configuration, user preferences, or simple caching that doesn't require SQL relations.
- **R2 (Object Storage)**: Use for large assets, user uploads, and file storage.
- **Durable Objects (DO)**: Use for stateful coordination, real-time collaboration (WebSockets), or features requiring strong consistency for a specific entity (e.g., a shared document or a game room).
- **Workflows**: Use for long-running, multi-step processes that require reliability and retries (e.g., multi-stage onboarding, complex billing cycles).
- **Queues**: Use for asynchronous background tasks, decoupling services, and handling spikes in traffic (e.g., processing email notifications).
- **Workers AI**: Use for built-in, low-latency AI inference (LLMs, Whisper, Image generation) directly on the edge.
- **Analytics Engine**: Use for gathering high-cardinality telemetry and usage metrics without overloading the primary database.

### Shared Services Boundary

- **Server Functions vs. Data Service**:
  - Use **Server Functions** for logic tightly coupled to the UI/Route.
  - Use the **Data Service (Hono)** for standalone APIs, shared logic, background tasks, or orchestrating **Durable Objects** and **Workflows**.

### Coding Standards

- **TypeScript**: Strict mode. Use `import type`.
- **Naming**: Use **kebab-case** for all filenames.
- **Components**: Functional components with React Hooks. Prefer Base UI.
- **Styling**: Use **Tailwind CSS v4**. Prefer utility-first classes. Avoid `@apply`.
- **Imports**: Use `@/*` for app-local source and `@workspace/ui/*` for shared components.

### Data & Auth Guidelines

- **Schema Location**: NEVER define Drizzle schemas in apps. Define them in `packages/data-ops/src/drizzle`.
- **Schema Change Loop**: Update schema -> `pnpm run build:data-ops` -> Update app code.
- **Bindings**: Access Cloudflare bindings globally using `import { env } from "cloudflare:workers"`.
- **Database Init**: Use the custom server entry in `apps/user-application/src/server.ts` to initialize database and auth on every request.

### Database Migrations (Local)

```bash
npx wrangler d1 execute DB --local --file=../../packages/data-ops/src/drizzle/<migration_file>.sql
```

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
