import sharedConfig from './packages/prettier-config/index.js';

export default {
  ...sharedConfig,
  plugins: [], // Avoid plugin resolution issues at root
};
