import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["projects/**/*", "src/assets/custom-libs/modernizr.d.ts"],
}, ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@angular-eslint/recommended",
    "plugin:@angular-eslint/template/process-inline-templates",
).map(config => ({
    ...config,
    files: ["**/*.ts"],
})), {
    files: ["**/*.ts"],

    rules: {
        "@angular-eslint/directive-selector": ["error", {
            type: "attribute",
            prefix: "app",
            style: "camelCase",
        }],

        "@angular-eslint/component-selector": ["error", {
            type: "element",
            prefix: "app",
            style: "kebab-case",
        }],

        // The following rules are recommend by either angular-eslint typescript-eslint, but we were not following
        // them in all places at time of setting up eslint. Leaving them turned off for now as a sort of crude baseline.
        // Consider turning any or all of them back on and fixing issues.
        "@angular-eslint/prefer-standalone": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-unused-vars": ["error", {
            // https://johnnyreilly.com/typescript-eslint-no-unused-vars
            // intentionally ignored vars, args etc must start with underscore
            args: "all",
            argsIgnorePattern: "^_",
            caughtErrors: "all",
            caughtErrorsIgnorePattern: "^_",
            destructuredArrayIgnorePattern: "^_",
            varsIgnorePattern: "^_",
            ignoreRestSiblings: true
        }],
        "no-extra-boolean-cast": "off",
        "no-prototype-builtins": "off",
        "no-unexpected-multiline": "off",
    },
}, ...compat.extends(
    "plugin:@angular-eslint/template/recommended",
    "plugin:@angular-eslint/template/accessibility",
).map(config => ({
    ...config,
    files: ["**/*.html"],
})), {
    files: ["**/*.html"],

    rules: {
      // add any customisations wanted for rules in html files here.
    },
}];
