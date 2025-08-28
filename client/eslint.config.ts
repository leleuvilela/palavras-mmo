import js from "@eslint/js";
import react from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js, react },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
]);
