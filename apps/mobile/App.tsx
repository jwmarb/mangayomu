/* eslint-disable no-restricted-imports */
import { LogBox } from 'react-native';
import CosmosApp from './App.cosmos';
import MainApp from './App.main';
import AppProvider from '@/providers/app';

console.warn = (...args: any[]) => {
  const output = args.join(' ');
  if (!output.includes('[Reanimated]')) {
    console.warn(args);
  }
};

export default function App() {
  return <AppProvider>{__DEV__ ? <CosmosApp /> : <MainApp />}</AppProvider>;
}
