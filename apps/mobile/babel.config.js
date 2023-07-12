// eslint-disable-next-line no-undef
module.exports = {
  presets: ['@rnx-kit/babel-preset-metro-react-native'],
  plugins: [
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
