import js from "@eslint/js";
import globals from "globals";
import prettierConfig from "eslint-config-prettier";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      "no-unused-vars": "warn",
    },
  },
  prettierConfig,
];
