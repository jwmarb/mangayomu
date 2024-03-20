import React from 'react';
import { View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import Screen from '@/components/primitives/Screen';
import Text from '@/components/primitives/Text';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';
import { useExploreStore } from '@/stores/explore';
import MangaList from '@/screens/Home/tabs/Explore/components/MangaList';

const REFETCH_INTERVAL = 1000 * 60 * 30; // 30 minutes

export default function Explore() {
  const getMangasFromPinnedSources = useExploreStore(
    (state) => state.getMangasFromPinnedSources,
  );
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['explore'],
    queryFn: () => getMangasFromPinnedSources(),
    refetchInterval: REFETCH_INTERVAL,
  });
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
      <MangaList
        title="Recently updated"
        data={data?.latest}
        isFetching={isFetching}
      />
      <MangaList
        title="Trending updates"
        data={data?.trending}
        isFetching={isFetching}
      />
    </Screen>
  );
}
