const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  watchFolders: [
    path.resolve('node_modules'),
    // Here we need to resolve node_modules because there are dependencies that aren't part of nohoist
    path.resolve('..', '..', 'node_modules'),
    path.resolve('..', '..', 'packages'),
  ],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
