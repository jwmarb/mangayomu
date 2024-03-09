import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '@/providers/theme';

export type AppProviderProps = React.PropsWithChildren;

const styles = StyleSheet.create({
  gestureHandlerRootView: { flex: 1 },
});

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <NavigationContainer>
      <GestureHandlerRootView style={styles.gestureHandlerRootView}>
        <SafeAreaProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </NavigationContainer>
  );
}
