import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/providers/theme';

export type AppProviderProps = React.PropsWithChildren;

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <SafeAreaProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </SafeAreaProvider>
  );
}
