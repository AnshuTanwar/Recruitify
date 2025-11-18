import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  // TypeScript config
  {
    ignores: ['dist'],
    extends: [
      js.configs.recommended,
      // use the string form for the typescript recommended config
      'plugin:@typescript-eslint/recommended',
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // include the plugin's recommended rules if available
      ...(tsPlugin.configs?.recommended?.rules ?? {}),
      // include react-hooks recommended rules (from plugin)
      ...(reactHooks.configs?.recommended?.rules ?? {}),
      // react-refresh rule (same as your original)
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },

  // JavaScript / JSX config
  {
    ignores: ['dist'],
    extends: [js.configs.recommended],
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...(reactHooks.configs?.recommended?.rules ?? {}),
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
];
