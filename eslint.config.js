// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier/recommended'

export default tseslint.config(
    {
        ignores: [
            'dist/**/*',
            '.vite/**/*',
            'node_modules/**/*',
            'eslint.config.js',     // ← quan trọng: bỏ lint chính file config
            '*.config.js',
            '*.config.ts',
        ],
    },

    // Config chính
    js.configs.recommended,
    ...tseslint.configs.recommended,

    {
        files: ['**/*.{ts,tsx}'],
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'warn',
            'no-console': 'warn',
        },
        languageOptions: {
            globals: globals.browser,
            ecmaVersion: 2022,
        },
    },

    // Prettier phải để cuối
    prettierConfig,
    prettierPlugin,
)