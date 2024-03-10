/* eslint-disable no-undef */
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@': './src',
        },
      },
    ],
    'react-native-reanimated/plugin'
  ],
};
