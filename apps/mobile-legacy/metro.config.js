const { getMetroTools } = require('react-native-monorepo-tools');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const path = require('path');
const metroTools = getMetroTools();

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  // watchFolders: [path.resolve(__dirname, '../../node_modules')],
  watchFolders: [
    ...metroTools.watchFolders,
    path.resolve(__dirname, 'node_modules'),
  ],
  resolver: {
    blockList: exclusionList(metroTools.blockList),
    extraNodeModules: metroTools.extraNodeModules,
  },
  // resolver: {
  //   resolveRequest: MetroSymlinksResolver(),
  // },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
