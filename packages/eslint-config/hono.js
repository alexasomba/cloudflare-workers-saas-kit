import hono from "@hono/eslint-config";
import { config as baseConfig } from "./base.js";

/** @type {import("eslint").Linter.Config[]} */
export const config = [
  ...baseConfig,
  ...hono,
  {
    name: "workspace/hono-overrides",
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["eslint.config.js"],
        },
      },
    },
    rules: {
      "no-console": "warn",
    },
  },
];
