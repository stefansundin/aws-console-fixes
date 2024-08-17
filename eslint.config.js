import globals from 'globals';

import js from '@eslint/js';

/**
 * @import { Linter } from 'eslint'
 */

/** @type {Linter.RulesRecord} */
const rules = {
  'no-unneeded-ternary': ['warn'],
  'no-unused-expressions': ['warn'],
  'no-unused-vars': [
    'warn',
    {
      args: 'none',
    },
  ],
  'no-var': ['warn'],
  'prefer-const': ['warn'],
  camelcase: ['warn'],
  eqeqeq: ['warn'],
  yoda: ['warn'],
};

/** @type {Linter.Config[]} */
export default [
  {
    ignores: ['**/bootstrap.*.js', 'scripts/*.mjs'],
  },
  js.configs.recommended,
  {
    files: ['chrome/sw.js', 'firefox/sw.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.serviceworker,
        chrome: 'readonly',
      },
    },
    rules,
  },
  {
    files: ['chrome/**/*.js', 'firefox/**/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        chrome: 'readonly',
      },
    },
    rules,
  },
];
