module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
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
