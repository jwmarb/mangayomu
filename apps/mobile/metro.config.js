const { getMetroTools } = require('react-native-monorepo-tools');
const exclusionList = require('metro-config/src/defaults/exclusionList');

/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const metroTools = getMetroTools();

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false, // set to 'true' when not using storybook
      },
    }),
  },
  // watchFolders: [path.resolve(__dirname, '../../node_modules')],
  watchFolders: metroTools.watchFolders,
  resolver: {
    blockList: exclusionList(metroTools.blockList),
    extraNodeModules: metroTools.extraNodeModules,
  },
  // resolver: {
  //   resolveRequest: MetroSymlinksResolver(),
  // },
};
