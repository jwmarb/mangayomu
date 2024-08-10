import GlobalSettings from '@/screens/ReaderSettings/components/ui/GlobalSettings';
import Tabs from '@/components/composites/Tabs';
import React from 'react';
import { Route, SceneMap } from 'react-native-tab-view';
import withScrollable from '@/screens/ReaderSettings/helpers/withScrollable';
import Miscellaneous from '@/screens/ReaderSettings/components/ui/Miscellaneous';
import { RootStackProps } from '@/screens/navigator';
import ForThisSeries from '@/screens/ReaderSettings/components/ui/ForThisSeries';
import { ForThisSeriesProvider } from '@/screens/ReaderSettings/context';
import useLoadAfterInteractions from '@/hooks/useLoadAfterInteractions';

const renderScene = SceneMap({
  global: withScrollable(GlobalSettings),
  misc: withScrollable(Miscellaneous),
  local: withScrollable(ForThisSeries),
});

export default function ReaderSettings(
  props: RootStackProps<'ReaderSettings'>,
) {
  const manga = props.route.params?.manga;
  const routes: Route[] = [
    { key: 'global', title: 'Global' },
    ...(manga != null ? [{ key: 'local', title: 'For this series' }] : []),
    { key: 'misc', title: manga != null ? 'Misc.' : 'Miscellaneous' },
  ];
  const [index, setIndex] = React.useState<number>(manga == null ? 0 : 1);
  const navigationState = { index, routes };
  const isReady = useLoadAfterInteractions();

  if (!isReady) {
    return null;
  }

  if (manga != null) {
    return (
      <ForThisSeriesProvider value={manga}>
        <Tabs
          onIndexChange={setIndex}
          navigationState={navigationState}
          renderScene={renderScene}
        />
      </ForThisSeriesProvider>
    );
  }
  return (
    <Tabs
      onIndexChange={setIndex}
      navigationState={navigationState}
      renderScene={renderScene}
    />
  );
}
