import { ResourceLoaderProps } from '@utils/ResourceLoader/ResourceLoader.interfaces';
import React from 'react';
import { Nunito_400Regular, Nunito_300Light, Nunito_700Bold, Nunito_600SemiBold } from '@expo-google-fonts/nunito';
import { Roboto_400Regular, Roboto_300Light, Roboto_700Bold, Roboto_500Medium } from '@expo-google-fonts/roboto';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import StorageManager from '@utils/StorageManager';
import DownloadManager from '@utils/DownloadManager';
import { Appearance, AppState, useColorScheme, View } from 'react-native';
import { AppState as StoreState, useAppDispatch } from '@redux/store';
import ExpoStorage from '@utils/ExpoStorage';
import { ThemeProvider } from 'styled-components/native';
import theme, { Color, FontFamily } from '@theme/core';
import { useSelector } from 'react-redux';
import { ChangeableTheme } from '@redux/reducers/settingsReducer/settingsReducer.constants';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { HoldMenuProvider } from 'react-native-hold-menu';
import { NavigationContainer, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import {
  OpenSans_300Light,
  OpenSans_400Regular,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootSiblingParent } from 'react-native-root-siblings';
import * as ScreenOrientation from 'expo-screen-orientation';
import {
  Quicksand_300Light,
  Quicksand_400Regular,
  Quicksand_600SemiBold,
  Quicksand_700Bold,
} from '@expo-google-fonts/quicksand';
import { Caveat_400Regular, Caveat_500Medium, Caveat_600SemiBold, Caveat_700Bold } from '@expo-google-fonts/caveat';
import {
  ChakraPetch_300Light,
  ChakraPetch_400Regular,
  ChakraPetch_600SemiBold,
  ChakraPetch_700Bold,
} from '@expo-google-fonts/chakra-petch';
import {
  MontserratAlternates_300Light,
  MontserratAlternates_400Regular,
  MontserratAlternates_600SemiBold,
  MontserratAlternates_700Bold,
} from '@expo-google-fonts/montserrat-alternates';
import {
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';

async function loadFonts() {
  await Font.loadAsync({
    Nunito: Nunito_400Regular,
    'Nunito-light': Nunito_300Light,
    'Nunito-heavy': Nunito_700Bold,
    'Nunito-semi': Nunito_600SemiBold,
    Roboto: Roboto_400Regular,
    'Roboto-light': Roboto_300Light,
    'Roboto-heavy': Roboto_700Bold,
    'Roboto-semi': Roboto_500Medium,
    'Open Sans': OpenSans_400Regular,
    'Open Sans-light': OpenSans_300Light,
    'Open Sans-semi': OpenSans_600SemiBold,
    'Open Sans-heavy': OpenSans_700Bold,
    Quicksand: Quicksand_400Regular,
    'Quicksand-light': Quicksand_300Light,
    'Quicksand-semi': Quicksand_600SemiBold,
    'Quicksand-heavy': Quicksand_700Bold,
    Caveat: Caveat_500Medium,
    'Caveat-light': Caveat_400Regular,
    'Caveat-semi': Caveat_600SemiBold,
    'Caveat-heavy': Caveat_700Bold,
    'Chakra Petch': ChakraPetch_400Regular,
    'Chakra Petch-light': ChakraPetch_300Light,
    'Chakra Petch-semi': ChakraPetch_600SemiBold,
    'Chakra Petch-heavy': ChakraPetch_700Bold,
    'Montserrat Alternates': MontserratAlternates_400Regular,
    'Montserrat Alternates-light': MontserratAlternates_300Light,
    'Montserrat Alternates-semi': MontserratAlternates_600SemiBold,
    'Montserrat Alternates-heavy': MontserratAlternates_700Bold,
    Montserrat: Montserrat_400Regular,
    'Montserrat-light': Montserrat_300Light,
    'Montserrat-heavy': Montserrat_700Bold,
    'Montserrat-semi': Montserrat_600SemiBold,
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
        await loadFonts();
        await StorageManager.initialize();
        await DownloadManager.initialize();
        dispatch({ type: 'SET_DEVICE_ORIENTATION', orientation: await ScreenOrientation.getOrientationAsync() });
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
        const deviceOrientationListener = ScreenOrientation.addOrientationChangeListener((orientation) => {
          dispatch({ type: 'SET_DEVICE_ORIENTATION', orientation: orientation.orientationInfo.orientation });
        });
        return () => {
          appStateListener.remove();
          deviceOrientationListener.remove();
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
          <NavigationContainer theme={generated['@react-navigation']}>
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
