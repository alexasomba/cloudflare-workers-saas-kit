import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(js.configs.recommended, ...tseslint.configs.recommended, {
  ignores: [
    '**/dist/**',
    '**/node_modules/**',
    '**/.nx/**',
    '**/prettier.config.js',
    '**/postcss.config.js',
    '**/tailwind.config.js',
    'demo/**', // Ignore demo directory for now to avoid noise
  ],
});
