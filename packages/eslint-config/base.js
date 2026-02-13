import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import onlyWarn from 'eslint-plugin-only-warn';
import tseslint from 'typescript-eslint';

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: [
      'dist/**',
      '**/prettier.config.js',
      '**/postcss.config.js',
      '**/tailwind.config.js',
      '**/routeTree.gen.ts',
    ],
  },
  eslintConfigPrettier,
];
