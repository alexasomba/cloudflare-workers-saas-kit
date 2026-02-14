import { config } from '@workspace/eslint-config/tanstack-react';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  {
    files: ['src/routes/api/ai/*.ts', 'src/routes/_static/docs/$name.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
