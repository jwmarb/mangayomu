import React from 'react';
import { RootStack } from '@/screens/navigator';
import Home from '@/screens/Home';
import MangaView from '@/screens/MangaView';
import SourceBrowser from '@/screens/SourceBrowser';
import { initialize } from '@/utils/image';
import ExtendedMangaList from '@/screens/ExtendedMangaList';
import Reader from '@/screens/Reader';
import ReaderSettings from '@/screens/ReaderSettings';
import AppearanceSettings from '@/screens/AppearanceSettings';
import { StaticHeader } from '@/components/composites/Header';

const HOME_SCREEN_OPTIONS = { headerShown: false };
const READER_SCREEN_OPTIONS = { headerShown: false };

function App(): React.JSX.Element {
  React.useEffect(() => {
    initialize();
  }, []);
  return (
    <RootStack.Navigator
      initialRouteName="Home"
      screenOptions={{ header: StaticHeader }}
    >
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
      <RootStack.Screen
        name="Reader"
        component={Reader}
        options={READER_SCREEN_OPTIONS}
      />
      <RootStack.Screen
        name="ReaderSettings"
        component={ReaderSettings}
        options={{
          title: 'Reader settings',
        }}
      />
      <RootStack.Screen
        name="AppearanceSettings"
        component={AppearanceSettings}
      />
    </RootStack.Navigator>
  );
}

export default App;
