// module.exports = __DEV__ ? require('./App.cosmos') : require('./App.main');

import CosmosApp from './App.cosmos';
import MainApp from './App.main';
import AppProvider from './src/providers/app';

export default function App() {
  return <AppProvider>{__DEV__ ? <CosmosApp /> : <MainApp />}</AppProvider>;
}
