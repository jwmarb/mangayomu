import { ResourceLoaderProps } from '@utils/ResourceLoader/ResourceLoader.interfaces';
import React from 'react';
import { Nunito_400Regular, Nunito_300Light, Nunito_700Bold, Nunito_600SemiBold } from '@expo-google-fonts/nunito';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import StorageManager from '@utils/StorageManager';
import DownloadManager from '@utils/DownloadManager';
import { Appearance, AppState, useColorScheme, View } from 'react-native';
import { AppState as StoreState, useAppDispatch } from '@redux/store';
import ExpoStorage from '@utils/ExpoStorage';
import { ThemeProvider } from 'styled-components/native';
import theme, { Color } from '@theme/core';
import { useSelector } from 'react-redux';
import { ChangeableTheme } from '@redux/reducers/settingsReducer/settingsReducer.constants';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { HoldMenuProvider } from 'react-native-hold-menu';
import { NavigationContainer, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootSiblingParent } from 'react-native-root-siblings';
async function asyncLoader() {
  await Font.loadAsync({
    Nunito: Nunito_400Regular,
    'Nunito-light': Nunito_300Light,
    'Nunito-heavy': Nunito_700Bold,
    'Nunito-semi': Nunito_600SemiBold,
  });
}

const ResourceLoader: React.FC<ResourceLoaderProps> = (props) => {
  const { onFinishedLoading: Component } = props;
  const [ready, setReady] = React.useState<boolean>(false);
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const mode = useSelector((state: StoreState) => state.settings.theme);
  const generated = React.useMemo(() => {
    switch (mode) {
      case ChangeableTheme.LIGHT:
        return theme('light');
      case ChangeableTheme.DARK:
        return theme('dark');
      case ChangeableTheme.SYSTEM_THEME:
        return theme(colorScheme);
    }
  }, [mode, colorScheme]);

  React.useEffect(() => {
    (async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await ExpoStorage.initialize();
        await asyncLoader();
        await StorageManager.initialize();
        await DownloadManager.initialize();
        dispatch({ type: 'REHYDRATE' });
      } catch (e) {
        console.error(e);
      } finally {
        setReady(true);
        const appStateListener = AppState.addEventListener('change', (appState) => {
          switch (appState) {
            case 'inactive':
            case 'background':
              StorageManager.cleanup();
              break;
            case 'active':
              StorageManager.initialize();
              break;
          }
        });
        return () => {
          appStateListener.remove();
        };
      }
    })();
  }, []);

  const handleOnLayout = React.useCallback(async () => {
    if (ready) await SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <View style={{ flex: 1 }} onLayout={handleOnLayout}>
      <ThemeProvider theme={generated}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer>
            <RootSiblingParent>
              <HoldMenuProvider iconComponent={FeatherIcon} theme={generated.palette.mode ?? 'light'}>
                <NavigationThemeProvider value={generated['@react-navigation']}>{Component}</NavigationThemeProvider>
              </HoldMenuProvider>
            </RootSiblingParent>
          </NavigationContainer>
        </GestureHandlerRootView>
      </ThemeProvider>
    </View>
  );
};

export default ResourceLoader;
