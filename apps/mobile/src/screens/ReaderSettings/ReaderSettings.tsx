import GlobalSettings from '@/screens/ReaderSettings/components/ui/GlobalSettings';
import Tabs from '@/components/composites/Tabs';
import React from 'react';
import { Route, SceneMap } from 'react-native-tab-view';
import withScrollable from '@/screens/ReaderSettings/helpers/withScrollable';
import Miscellaneous from '@/screens/ReaderSettings/components/ui/Miscellaneous';

const routes: Route[] = [
  { key: 'global', title: 'Global' },
  { key: 'misc', title: 'Miscellaneous' },
];

const renderScene = SceneMap({
  global: withScrollable(GlobalSettings),
  misc: withScrollable(Miscellaneous),
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
