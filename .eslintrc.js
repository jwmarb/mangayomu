/* eslint-env node */
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    quotes: ['warn', 'single'],
    semi: ['warn', 'always'],
    'arrow-parens': ['warn', 'always'],
    'array-element-newline': ['warn', 'consistent'],
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['apps/expo/*', 'dist/'],
  root: true,
};
