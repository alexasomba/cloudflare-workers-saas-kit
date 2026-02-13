# Hooks

## `useColorTokens`

File: `src/hooks/use-color-tokens.ts`

Purpose: expose the palette/semantic tokens in JS (useful for charts, dynamic styling).

Example:

```ts
import { useColorTokens } from '@workspace/ui/hooks/use-color-tokens';

function Example() {
  const tokens = useColorTokens();
  return tokens.primary;
}
```

## `useMobile`

File: `src/hooks/use-mobile.ts`

Purpose: lightweight mobile breakpoint detection used by some responsive components.

Example:

```ts
import { useMobile } from '@workspace/ui/hooks/use-mobile';

function Example() {
  const isMobile = useMobile();
  return isMobile ? 'mobile' : 'desktop';
}
```

## `useCarousel`

Exported from: `src/components/carousel.tsx`

Purpose: internal carousel context hook for `Carousel*` subcomponents.

Notes:

- `useCarousel` must be used within `<Carousel>`.
- Prefer using `<CarouselContent>`, `<CarouselItem>`, `<CarouselPrevious>`, `<CarouselNext>` unless you need direct API access.
