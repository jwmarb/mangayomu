import { database } from 'database';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import {
  QueryClient,
  QueryClientProvider,
  onlineManager,
} from '@tanstack/react-query';
import { PortalProvider } from '@gorhom/portal';
import { MenuProvider } from 'react-native-popup-menu';
import NetInfo from '@react-native-community/netinfo';
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import { ThemeProvider } from '@/providers/theme';

export type AppProviderProps = React.PropsWithChildren;

const styles = StyleSheet.create({
  gestureHandlerRootView: { flex: 1 },
});

const queryClient = new QueryClient();

onlineManager.setEventListener((setOnline) =>
  NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  }),
);

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <GestureHandlerRootView style={styles.gestureHandlerRootView}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <MenuProvider>
              <PortalProvider>
                <DatabaseProvider database={database}>
                  {children}
                </DatabaseProvider>
              </PortalProvider>
            </MenuProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
