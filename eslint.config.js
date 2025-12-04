import js from "@eslint/js";
import globals from "globals";
import reactHooks from "react-hooks";
import reactRefresh from "react-refresh";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier/recommended";

export default tseslint.config(
    { ignores: ["dist", ".vite", "node_modules"] },
    {
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            prettier,
        ],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2022,
            globals: globals.browser,
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],
            // Một số rule phổ biến mà team Việt Nam hay dùng
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": "error",
            "no-console": "warn",
            "prefer-const": "error",
        },
    }
);