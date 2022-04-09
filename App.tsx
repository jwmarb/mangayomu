import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import store from '@redux/store';
import Root from './src/Root';
import { ThemeProvider } from 'styled-components/native';
import theme from '@theme/core';

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme()}>
        <Root />
      </ThemeProvider>
    </Provider>
  );
}
