module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      '@babel/plugin-proposal-export-namespace-from',
      [
        'module-resolver',
        {
          alias: {
            '@components': './src/components',
            '@services': './src/services',
            '@redux': './src/redux',
            '@hooks': './src/hooks',
            '@navigators': './src/navigators',
            '@screens': './src/screens',
            '@utils': './src/utils',
            '@theme': './src/theme',
            '@context': './src/context',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
