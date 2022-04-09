import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import store from '@redux/store';
import Root from './src/Root';

export default function App() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}
