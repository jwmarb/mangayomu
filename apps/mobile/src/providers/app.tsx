import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PortalProvider } from '@gorhom/portal';
import { ThemeProvider } from '@/providers/theme';

export type AppProviderProps = React.PropsWithChildren;

const styles = StyleSheet.create({
  gestureHandlerRootView: { flex: 1 },
});

const queryClient = new QueryClient();

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <GestureHandlerRootView style={styles.gestureHandlerRootView}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <PortalProvider>{children}</PortalProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
