import CosmosApp from 'App.cosmos';
import MainApp from 'App.main';
import AppProvider from '@/providers/app';

export default function App() {
  return <AppProvider>{__DEV__ ? <CosmosApp /> : <MainApp />}</AppProvider>;
}
