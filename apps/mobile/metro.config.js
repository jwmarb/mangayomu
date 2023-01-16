const {getMetroTools} = require('react-native-monorepo-tools');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const monorepoMetroTools = getMetroTools();

/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  watchFolders: monorepoMetroTools.watchFolders,
  resolver: {
    blockList: exclusionList(monorepoMetroTools.blockList),
    extraNodeModules: exclusionList.extraNodeModules,
  },
};
