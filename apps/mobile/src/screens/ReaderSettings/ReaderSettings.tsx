import GlobalSettings from '@/screens/ReaderSettings/components/ui/GlobalSettings';
import Tabs from '@/components/composites/Tabs';
import React from 'react';
import { Route, SceneMap } from 'react-native-tab-view';
import withScrollable from '@/screens/ReaderSettings/helpers/withScrollable';

const routes: Route[] = [{ key: 'global', title: 'Global' }];

const renderScene = SceneMap({
  global: withScrollable(GlobalSettings),
});

export default function ReaderSettings() {
  const [index, setIndex] = React.useState<number>(0);
  const navigationState = { index, routes };
  return (
    <Tabs
      onIndexChange={setIndex}
      navigationState={navigationState}
      renderScene={renderScene}
    />
  );
}
