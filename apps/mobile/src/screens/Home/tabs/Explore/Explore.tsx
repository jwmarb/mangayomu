import React from 'react';
import { RefreshControl } from 'react-native-gesture-handler';
import Screen from '@/components/primitives/Screen';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';
import MangaList from '@/screens/Home/tabs/Explore/components/MangaList';
import useExploreMangas from '@/screens/Home/tabs/Explore/hooks/useExploreMangas';
import { ExploreFetchStatusContext } from '@/screens/Home/tabs/Explore/context';
import BottomSheet from '@/components/composites/BottomSheet';
import ErrorSheet from '@/screens/Home/tabs/Explore/components/ErrorSheet';

export default function Explore() {
  const { data, isFetching, refetch, fetchStatus } = useExploreMangas();
  const bottomSheet = React.useRef<BottomSheet>(null);
  const collapsible = useCollapsibleHeader({
    title: 'Explore',
  });

  function handleOnViewErrors() {
    bottomSheet.current?.open();
  }

  return (
    <ExploreFetchStatusContext.Provider value={fetchStatus}>
      <Screen
        collapsible={collapsible}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
      >
        <MangaList
          onViewErrors={handleOnViewErrors}
          data={data?.latest}
          isFetching={isFetching}
          type="latest"
        />
        <MangaList
          onViewErrors={handleOnViewErrors}
          data={data?.trending}
          isFetching={isFetching}
          type="trending"
        />
      </Screen>
      <ErrorSheet ref={bottomSheet} />
    </ExploreFetchStatusContext.Provider>
  );
}
