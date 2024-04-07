/* eslint-disable no-undef */
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    [
      'module-resolver',
      {
        alias: {
          '@': './src',
          database: './index.native.ts',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
