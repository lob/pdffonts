'use strict';
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
    rules: {
      // From eslint-config-lob rules
      'arrow-parens': 'error',
      'arrow-spacing': 'error',
      'constructor-super': 'error',
      'generator-star-spacing': 'error',
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
      'prefer-reflect': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      'require-yield': 'error'
    }
  }
];
