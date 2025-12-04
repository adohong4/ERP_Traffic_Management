// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettierConfig from "eslint-config-prettier";           // ← thêm dòng này
import prettierPlugin from "eslint-plugin-prettier/recommended"; // ← giữ dòng này

export default tseslint.config(
    { ignores: ["dist", ".vite", "node_modules"] },

    // 1. Cấu hình cơ bản
    js.configs.recommended,
    ...tseslint.configs.recommended,

    // 2. React + Hooks
    {
        files: ["**/*.{ts,tsx}"],
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
        },
    },

    // 3. Prettier – PHẢI ĐẶT CUỐI CÙNG
    prettierConfig,        // ← tắt rule ESLint xung đột với Prettier
    prettierPlugin,        // ← bật plugin prettier/recommended

    // 4. Rule tùy chỉnh của bạn
    {
        rules: {
            quotes: ["error", "single", { avoidEscape: true, allowTemplateLiterals: true }],
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
            "@typescript-eslint/no-explicit-any": "warn",
            "no-console": "warn",
        },
        languageOptions: {
            globals: globals.browser,
            ecmaVersion: 2022,
        },
    }
);