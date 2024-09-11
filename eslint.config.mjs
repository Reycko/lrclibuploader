import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ),
  {
    languageOptions: {
      parser: tsParser,
    },

    rules: {
      'prettier/prettier': ['warn', { singleQuote: true }],
      semi: ['off', 'always'], // Included in prettier
      '@typescript-eslint/no-require-imports': 'warn',
    },
  },
  {
    ignores: ['dist/**', 'test/**'],
  },
];
