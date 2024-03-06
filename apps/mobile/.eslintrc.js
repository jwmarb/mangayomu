/* eslint-disable no-undef */
/**
 * @type {import("eslint").ESLint.ConfigData}
 */
module.exports = {
  extends: '../../.eslintrc.js',
  ignorePatterns: ['metro.config.js', 'index.js', 'cosmos.imports.ts'],
  plugins: ['import'],
  overrides: [
    {
      files: ['**/index.ts'],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
  ],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: ['.*'],
      },
    ],
    'import/order': [
      'error',
      {
        groups: [
          'index',
          'sibling',
          'parent',
          'internal',
          'external',
          'builtin',
          'object',
          'type',
        ],
      },
    ],
  },
};
