import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import pluginQuery from '@tanstack/eslint-plugin-query';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [...compat.extends('next/core-web-vitals', 'next/typescript')];

const config = {
  ...eslintConfig,
  plugins: {
    '@tanstack/query': pluginQuery,
    ...eslintConfig.plugins,
  },
  rules: {
    '@tanstack/query/exhaustive-deps': 'error',
    ...eslintConfig.rules,
    'no-restricted-imports': [
      'error',
      {
        patterns: ['../*'],
      },
    ],
  },
};

export default config;
