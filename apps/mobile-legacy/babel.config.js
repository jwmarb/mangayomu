// eslint-disable-next-line no-undef
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['react-native-worklets-core/plugin'],
    'module:react-native-dotenv',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@navigators': './src/navigators',
          '@screens': './src/screens',
          '@theme': './src/theme',
          '@components': './src/components',
          '@redux': './src/redux',
          '@mmkv-storage': './src/mmkv',
          '@hooks': './src/hooks',
          '@assets': './src/assets',
          '@helpers': './src/helpers',
          '@database': './src/realm',
          env: './src/constants',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
