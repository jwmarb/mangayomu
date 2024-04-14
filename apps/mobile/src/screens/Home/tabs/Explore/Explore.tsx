import React from 'react';
import { RefreshControl } from 'react-native-gesture-handler';
import Screen from '@/components/primitives/Screen';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';
import MangaList from '@/screens/Home/tabs/Explore/components/MangaList';
import useExploreMangas from '@/screens/Home/tabs/Explore/hooks/useExploreMangas';
import { ExploreFetchStatusContext } from '@/screens/Home/tabs/Explore/context';

export default function Explore() {
  const { data, isFetching, refetch, fetchStatus } = useExploreMangas();
  const collapsible = useCollapsibleHeader({
    title: 'Explore',
  });

  return (
    <ExploreFetchStatusContext.Provider value={fetchStatus}>
      <Screen
        collapsible={collapsible}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
      >
        <MangaList data={data?.latest} isFetching={isFetching} type="latest" />
        <MangaList
          data={data?.trending}
          isFetching={isFetching}
          type="trending"
        />
      </Screen>
    </ExploreFetchStatusContext.Provider>
  );
}
