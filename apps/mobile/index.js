/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

let RegisteredApp = App;
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
RegisteredApp = __DEV__ ? require('./storybook').default : App;
// ^ comment this to go back to main app environment, and don't forget to go to metro.config.js

AppRegistry.registerComponent(appName, () => RegisteredApp);
