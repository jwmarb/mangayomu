const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');
/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  watchFolders: [
    path.resolve('node_modules'),
    // Here we need to resolve node_modules because there are dependencies that aren't part of nohoist
    path.resolve('..', '..', 'node_modules'),
  ],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
