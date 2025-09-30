import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import jest from "eslint-plugin-jest";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
    {
        ignores: ["dist", "node_modules"],
    },
    { files: ["src/**/*.{js,ts,jsx,tsx}", "tests/**/*.{js,ts,jsx,tsx}"] },
    { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
    { languageOptions: { globals: globals.node } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["tests/**/*.{js,ts,jsx,tsx}"],
        ...jest.configs["flat/recommended"],
        rules: {
            ...jest.configs["flat/recommended"].rules,
            "jest/prefer-expect-assertions": "off",
        },
    },
    {
        rules: {
            "prettier/prettier": [
                "error",
                {
                    endOfLine: "auto",
                },
            ],

            //* ES6
            "arrow-spacing": "error",
            "no-confusing-arrow": "error",
            "no-duplicate-imports": "error",
            "no-var": "error",
            "object-shorthand": "off",
            "prefer-const": "error",
            "prefer-template": "warn",
            "no-require-imports": "off",

            "no-console": "warn",
            "dot-notation": "error",
            "@typescript-eslint/no-unused-vars": "error",
            "@typescript-eslint/require-await": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",

            //* Avoid Bugs
            // 'no-undef': 'error',
            // semi: 'error',
            // 'semi-spacing': 'error',

            //* Best Practices
            eqeqeq: "warn",
            "no-invalid-this": "error",
            "no-return-assign": "error",
            "no-unused-expressions": ["error", { allowTernary: true }],
            "no-useless-concat": "error",
            "no-useless-return": "error",
            "no-constant-condition": "warn",
            // 'no-unused-vars': 'error', // Ignore unused arguments prefixed with `_`

            // Function parameter-specific rules
            "@typescript-eslint/explicit-module-boundary-types": "error", // Require explicit types for exported functions and parameters
            "@typescript-eslint/parameter-properties": "error", // Require explicit types for function parameters
            "@typescript-eslint/no-empty-function": "warn", // Warn against empty functions
        },
    },
    eslintPluginPrettierRecommended,
];
