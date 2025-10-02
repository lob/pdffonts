'use strict';
const stylistic = require('@stylistic/eslint-plugin');

module.exports = [
  {
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'script',
      globals: {
        expect: false,
        // From eslint-config-lob env settings
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        // Mocha globals
        describe: 'readonly',
        it: 'readonly',
        before: 'readonly',
        after: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly'
      }
    },
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      // From eslint-config-lob rules
      '@stylistic/arrow-parens': 'error',
      '@stylistic/arrow-spacing': 'error', 
      '@stylistic/generator-star-spacing': 'error',
      'no-class-assign': 'error',
      'no-confusing-arrow': 'error',
      'no-const-assign': 'error',
      'no-constant-condition': 'error',
      'no-dupe-class-members': 'error',
      'no-this-before-super': 'error',
      'no-var': 'error',
      'object-shorthand': ['error', 'properties'],
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      'require-yield': 'error'
    }
  }
];
