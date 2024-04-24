import React from 'react';
import { SceneMap } from 'react-native-tab-view';
import BottomSheet from '@/components/composites/BottomSheet';
import useExploreMangas from '@/screens/Home/tabs/Explore/hooks/useExploreMangas';
import Tabs from '@/components/composites/Tabs';
import tabGenerator from '@/screens/Home/tabs/Explore/components/ErrorSheet/tabGenerator';

const RecentlyUpdated = tabGenerator('latest');
const TrendingUpdates = tabGenerator('trending');

const renderScene = SceneMap({
  recent: RecentlyUpdated,
  trending: TrendingUpdates,
});

function ErrorSheet(_: unknown, ref: React.ForwardedRef<BottomSheet>) {
  const { data } = useExploreMangas();
  const [index, setIndex] = React.useState<number>(0);
  const routes = [
    {
      key: 'recent',
      title: `Recently updated (${data?.latest.errors.length ?? 0})`,
    },
    {
      key: 'trending',
      title: `Trending updates (${data?.trending.errors.length ?? 0})`,
    },
  ];
  const navigationState = { index, routes };
  return (
    <BottomSheet ref={ref}>
      <Tabs
        onIndexChange={setIndex}
        navigationState={navigationState}
        renderScene={renderScene}
      />
    </BottomSheet>
  );
}

export default React.forwardRef(ErrorSheet);
