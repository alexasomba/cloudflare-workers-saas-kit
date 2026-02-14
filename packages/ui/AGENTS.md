# UI Package Agent Guide

## 🤖 Identity

You are working on the **UI Package**, the shared design system powered by **Shadcn primitives**, **Base UI**, and **Tailwind CSS**.

- **Package**: `@workspace/ui`
- **Role**: Provide accessible, consistent, and reusable components to all apps.
- **Note**: **NEVER use Radix UI**. Use **Base UI** or **Shadcn primitives**.

## 📂 Project Structure

| Path                 | Purpose                         |
| :------------------- | :------------------------------ |
| `src/components/ui/` | Base Shadcn primitives.         |
| `src/components/`    | Custom shared components.       |
| `src/lib/`           | Utility functions (`cn`, etc.). |
| `src/hooks/`         | Shared React hooks.             |

## 📏 Coding Standards

### Design Tokens

- **Colors**: Use semantic names (`bg-background`, `text-primary`), NOT hex codes.
- **Spacing**: Use Tailwind spacing scale (`p-4`, `m-2`).

### Icons

- **Library**: Use `@phosphor-icons/react` or `lucide-react`.
- **Consistency**: Do not mix icon families.

### Accessibility

- **Validation**: All components must pass accessibility checks (`pnpm run contrast:check`).
- **Base UI**: Use **Base UI** or **Shadcn primitives** for complex interactions. **NEVER use Radix UI**.

## 🛠️ Workflows

### Add Component (Shadcn)

```bash
pnpx shadcn@latest add <component>
```

### Documentation

Generate API docs after changes:

```bash
pnpm run api:generate
```

### Verification

```bash
pnpm run lint
pnpm run contrast:check
```

## 🚫 Constraints

1.  **No App Logic**: Components here must be pure and presentational.
2.  **No Hardcoded Styles**: Use Tailwind classes exclusively.
