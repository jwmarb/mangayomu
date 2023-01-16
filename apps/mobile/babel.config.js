module.exports = {
  presets: ['@rnx-kit/babel-preset-metro-react-native'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@navigators': './src/navigators',
          '@screens': './src/screens',
        },
      },
    ],
  ],
};
