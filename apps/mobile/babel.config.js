/* eslint-env node */
module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    "@babel/plugin-proposal-export-namespace-from",
    [
      "module-resolver",
      {
        alias: {
          "@screens": "./src/screens",
          "@navigators": "./src/navigators",
        },
      },
    ],
  ],
};
