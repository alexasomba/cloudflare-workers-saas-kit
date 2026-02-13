import { config } from '@workspace/eslint-config/react-internal';

/** @type {import("eslint").Linter.Config} */
export default [
  {
    ignores: ['node_modules/', 'dist/', 'build/', 'coverage/', '*.min.js'],
  },
  ...config,
];
