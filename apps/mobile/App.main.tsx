import React from 'react';
import { RootStack } from '@/screens/navigator';
import Home from '@/screens/Home';
import MangaView from '@/screens/MangaView';
import SourceBrowser from '@/screens/SourceBrowser';
import { initialize } from '@/utils/image';
import ExtendedMangaList from '@/screens/ExtendedMangaList';

const HOME_SCREEN_OPTIONS = { headerShown: false };

function App(): React.JSX.Element {
  React.useEffect(() => {
    initialize();
  }, []);
  return (
    <RootStack.Navigator initialRouteName="Home">
      <RootStack.Screen
        name="Home"
        component={Home}
        options={HOME_SCREEN_OPTIONS}
      />
      <RootStack.Screen name="MangaView" component={MangaView} />
      <RootStack.Screen name="SourceBrowser" component={SourceBrowser} />
      <RootStack.Screen
        name="ExtendedMangaList"
        component={ExtendedMangaList}
      />
    </RootStack.Navigator>
  );
}

export default App;
