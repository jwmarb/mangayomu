import React from 'react';
import Screen from '@/components/primitives/Screen';
import useExploreMangas from '@/screens/Home/tabs/Explore/hooks/useExploreMangas';
import { RootStackProps } from '@/screens/navigator';
import ListHeaderComponent from '@/screens/ExtendedMangaList/header';
import {
  contentContainerStyle,
  getItemLayout,
  keyExtractor,
  renderItem,
  useColumns,
} from '@/screens/ExtendedMangaList';
import {
  ExploreErrorsContext,
  ExploreFetchStatusContext,
} from '@/screens/Home/tabs/Explore/context';
import {
  ExtendedMangaListMangasLengthContext,
  ExtendedMangaListUserInputContext,
} from '@/screens/ExtendedMangaList/context';
import ListEmptyComponent from '@/screens/ExtendedMangaList/empty';
import useExtendedMangaListCollapsible from '@/screens/ExtendedMangaList/hooks/useExtendedMangaListCollapsible';
import useExtendedMangaListPagination from '@/screens/ExtendedMangaList/hooks/useExtendedMangaListPagination';

export default function ExtendedMangaList(
  props: RootStackProps<'ExtendedMangaList'>,
) {
  const {
    route: {
      params: { type },
    },
  } = props;
  const { data: results, fetchStatus } = useExploreMangas();
  const errors = results?.[type].errors ?? [];
  const columns = useColumns();
  const { input, collapsible } = useExtendedMangaListCollapsible({ type });
  const {
    onEndReached,
    pages: { pages },
  } = useExtendedMangaListPagination({ type, results, input });

  return (
    <ExploreErrorsContext.Provider value={errors}>
      <ExploreFetchStatusContext.Provider value={fetchStatus}>
        <ExtendedMangaListMangasLengthContext.Provider value={pages.length}>
          <ExtendedMangaListUserInputContext.Provider value={input}>
            <Screen.FlatList
              ListHeaderComponent={ListHeaderComponent}
              onEndReached={onEndReached}
              onEndReachedThreshold={1}
              initialNumToRender={12}
              maxToRenderPerBatch={9}
              updateCellsBatchingPeriod={1000}
              contentContainerStyle={contentContainerStyle}
              key={columns}
              numColumns={columns}
              collapsible={collapsible}
              data={pages}
              ListEmptyComponent={ListEmptyComponent}
              getItemLayout={getItemLayout}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
            />
          </ExtendedMangaListUserInputContext.Provider>
        </ExtendedMangaListMangasLengthContext.Provider>
      </ExploreFetchStatusContext.Provider>
    </ExploreErrorsContext.Provider>
  );
}
