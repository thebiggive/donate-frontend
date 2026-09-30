import * as angular from "angular-eslint";
import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import browserCompat from "eslint-plugin-compat";
import * as tseslint from "typescript-eslint";

export default defineConfig(
  // 1. Global Ignores
  {
    ignores: ["projects/**/*", "src/assets/custom-libs/modernizr.d.ts"],
  },
  // 2. TypeScript / JavaScript
  {
    files: ["src/**/*.ts", "src/**/*.js"],
    extends: [
      // Apply the recommended core rules
      js.configs.recommended,
      // Apply recommended & stylistic TypeScript rules
      ...tseslint.configs.recommended, // TODO DON-1214 Add 'TypeChecked' for rule type info
      // ...tseslint.configs.stylistic, // TODO Maybe consider later to help make style more consistent.
      // Apply recommended Angular TypeScript rules
      ...angular.configs.tsRecommended,
    ],
    languageOptions: {
      parserOptions: {
        // projectService: true, // TODO DON-1214 Uncomment for rule type info
      },
    },
    processor: angular.processInlineTemplates,
    ...browserCompat.configs["flat/recommended"],
    settings: {
      lintAllEsApis: true,
    },
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],

      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          // https://johnnyreilly.com/typescript-eslint-no-unused-vars
          // intentionally ignored vars, args etc must start with underscore
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      // DON-1214 To-maybe-do. Not migrating away from eager detection en masse yet.
      "@angular-eslint/prefer-on-push-component-change-detection": "off",

      // TODO DON-1214 Bring back these rules when fixing rule type info
      // "@typescript-eslint/no-base-to-string": "error",
      // "@typescript-eslint/restrict-plus-operands": ["error", { allowNullish: false }],
    },
  },
  // 3. Angular HTML templates
  {
    files: ["src/**/*.html"],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      "@angular-eslint/template/no-positive-tabindex": ["error"],
    },
  },
);
