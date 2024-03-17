/* eslint-disable no-undef */
/** @type {import('jest').Config} */
module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|react-native-reanimated)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
};
