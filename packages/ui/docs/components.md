# Components

Components are exported via the package exports map.

## Import pattern

```ts
import { Button } from '@workspace/ui/components/button';
import { Card } from '@workspace/ui/components/card';
```

## Styling

Apps should import the shared stylesheet once:

```ts
import '@workspace/ui/globals.css';
```

## Notes

- Components follow shadcn/Base UI composition patterns.
- Prefer semantic token classes: `bg-background`, `text-foreground`, `border-border`, etc.
- For form fields, prefer the higher-level field wrappers where available (e.g. `TextField`, `NumberField`, `TextareaField`) so accessibility wiring stays consistent.
