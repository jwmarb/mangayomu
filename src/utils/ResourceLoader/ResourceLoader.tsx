import { ResourceLoaderProps } from '@utils/ResourceLoader/ResourceLoader.interfaces';
import React from 'react';
import { Nunito_400Regular, Nunito_300Light, Nunito_700Bold, Nunito_600SemiBold } from '@expo-google-fonts/nunito';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import DownloadManager from '@utils/DownloadManager';

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

  React.useEffect(() => {
    (async () => {
      try {
        await asyncLoader();
        await DownloadManager.initialize();
      } catch (e) {
        console.error(e);
      } finally {
        setReady(true);
      }
    })();
  }, []);
  return <>{!ready ? <AppLoading /> : Component}</>;
};

export default ResourceLoader;
