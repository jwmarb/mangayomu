/* eslint-disable no-restricted-imports */
import { rendererConfig, moduleWrappers } from './cosmos.imports';
import React from 'react';
import { NativeFixtureLoader } from 'react-cosmos-native';

// react-cosmos-native does not support TurboModules because NativeModules.SourceCode.scriptURL returns undefined. As a
// fix, the a websocket URL it would have created is hard-coded here and will remain here until they release a patch for this
// react-cosmos-native only works with a simulator and not a physical device
import * as Cosmos from 'react-cosmos-native/dist/getSocketUrl';
type CosmosImport = {
  getSocketUrl: () => string;
};
(Cosmos as CosmosImport).getSocketUrl = () => 'ws://10.0.2.2:5000';

export default function CosmosApp() {
  return (
    <NativeFixtureLoader
      rendererConfig={rendererConfig}
      moduleWrappers={moduleWrappers}
      initialFixtureId={{ path: 'App.fixture.tsx' }}
    />
  );
}
