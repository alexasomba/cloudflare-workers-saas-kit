export default {
  '*.{js,jsx,ts,tsx,astro}': ['eslint --fix', 'prettier --write'],
  '*.{ts,tsx}': () => 'pnpm run typecheck',
  '*.{json,md,yml,css}': ['prettier --write'],
};
