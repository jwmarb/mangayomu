import React from 'react';
import { ThemeProvider } from './theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export type AppProviderProps = React.PropsWithChildren;

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <SafeAreaProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </SafeAreaProvider>
  );
}
