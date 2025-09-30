import js from '@eslint/js';
import reactRecommended from 'eslint-plugin-react/configs/recommended';
import tseslintRecommended from '@typescript-eslint/eslint-plugin/dist/configs/recommended';

// ...existing code...

export default [
  js,
  reactRecommended,
  tseslintRecommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    // ...your custom rules...
    rules: {
      // ...existing code...
    },
  },
  // ...existing code...
];

