import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import templateParser from '@angular-eslint/template-parser';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

const tsConfig = compat.config({
    parserOptions: {
        project: ['tsconfig.json', 'e2e/tsconfig.json'],
        createDefaultProgram: true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates'
    ],
    rules: {
        '@angular-eslint/component-selector': [
            'error',
            {
                type: 'element',
                prefix: 'app',
                style: 'kebab-case'
            }
        ],
        '@angular-eslint/directive-selector': [
            'error',
            {
                type: 'attribute',
                prefix: 'app',
                style: 'camelCase'
            }
        ]
    }
});

const htmlConfig = compat.config({
    extends: ['plugin:@angular-eslint/template/recommended'],
    rules: {
        '@angular-eslint/template/eqeqeq': [
            'error',
            {
                allowNullOrUndefined: true
            }
        ]
    }
});

export default [
    {
        ignores: ['**/dist/**', '**/build/**', '**/node_modules/**', 'projects/api/**']
    },
    ...tsConfig.map((config) => ({ ...config, files: ['**/*.ts'] })),
    ...htmlConfig.map((config) => ({
        ...config,
        files: ['**/*.html'],
        languageOptions: {
            parser: templateParser
        }
    })),
    {
        files: ['**/*.js'],
        languageOptions: {
            parserOptions: {
                allowImportExportEverywhere: true
            }
        }
    }
];
