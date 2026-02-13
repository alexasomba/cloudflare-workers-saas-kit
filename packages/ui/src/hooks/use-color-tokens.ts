import { useMemo } from 'react';

export function useColorTokens() {
  return useMemo(
    () => ({
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        destructive: 'var(--destructive)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        popover: 'var(--popover)',
        card: 'var(--card)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    }),
    []
  );
}
