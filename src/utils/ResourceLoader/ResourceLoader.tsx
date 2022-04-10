import { ResourceLoaderProps } from '@utils/ResourceLoader/ResourceLoader.interfaces';
import React from 'react';
import { Nunito_400Regular, Nunito_300Light, Nunito_700Bold } from '@expo-google-fonts/nunito';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';

const ResourceLoader: React.FC<ResourceLoaderProps> = (props) => {
  const { onFinishedLoading: Component } = props;
  const [ready, setReady] = React.useState<boolean>(false);
  async function asyncLoader() {
    await Font.loadAsync({
      Nunito: Nunito_400Regular,
      'Nunito-light': Nunito_300Light,
      'Nunito-heavy': Nunito_700Bold,
    });
  }
  React.useEffect(() => {
    asyncLoader()
      .then(() => {
        setReady(true);
      })
      .catch(console.error);
  }, []);
  return <>{!ready ? <AppLoading /> : Component}</>;
};

export default ResourceLoader;
