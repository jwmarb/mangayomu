import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RefreshControl } from 'react-native-gesture-handler';
import Screen from '@/components/primitives/Screen';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';
import { useExploreStore } from '@/stores/explore';
import MangaList from '@/screens/Home/tabs/Explore/components/MangaList';
import useExploreMangas from '@/screens/Home/tabs/Explore/hooks/useExploreMangas';

export default function Explore() {
  const { data, isFetching, refetch } = useExploreMangas();
  const collapsible = useCollapsibleHeader({
    title: 'Explore',
  });

  return (
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
  );
}
