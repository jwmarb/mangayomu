import React from 'react';
import { SceneMap } from 'react-native-tab-view';
import { useWindowDimensions } from 'react-native';
import BottomSheet from '@/components/composites/BottomSheet';
import Filter from '@/components/composites/Filter';
import Tabs from '@/components/composites/Tabs';
import Sort from '@/screens/MangaView/components/filter/Sort';
import Language from '@/screens/MangaView/components/filter/Language';

const renderScene = SceneMap({
  sort: Sort,
  language: Language,
});

const routes = [
  {
    key: 'sort',
    title: 'Sort',
  },
  {
    key: 'language',
    title: 'Language',
  },
];

function FilterMenu(_: unknown, ref: React.ForwardedRef<BottomSheet>) {
  const [index, setIndex] = React.useState<number>(0);
  const { width } = useWindowDimensions();
  return (
    <BottomSheet ref={ref}>
      <Filter>
        <Tabs
          renderScene={renderScene}
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          initialLayout={{ width }}
        />
      </Filter>
    </BottomSheet>
  );
}

export default React.forwardRef(FilterMenu);
