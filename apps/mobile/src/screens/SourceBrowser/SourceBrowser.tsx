import React from 'react';
import { MangaSource } from '@mangayomu/mangascraper';
import BottomSheet from '@/components/composites/BottomSheet';
import Screen from '@/components/primitives/Screen';
import { RootStackProps } from '@/screens/navigator';
import Manga from '@/components/composites/Manga';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';
import Text from '@/components/primitives/Text';
import useUserInput from '@/hooks/useUserInput';
import { styles } from '@/screens/SourceBrowser/styles';
import useSourceBrowserHeader from '@/screens/SourceBrowser/hooks/useSourceBrowserHeader';
import useMangaSearchQuery from '@/screens/SourceBrowser/hooks/useMangaSearchQuery';
import useLoadAfterInteractions from '@/hooks/useLoadAfterInteractions';
import { getErrorMessage } from '@/utils/helpers';
import useFilters from '@/screens/SourceBrowser/hooks/useFilters';
const SourceFilters = React.lazy(
  () => import('@/screens/SourceBrowser/components/SourceFilters'),
);

export type InfiniteMangaData = {
  mangas: unknown[];
  source: MangaSource;
};

export type InfiniteMangaError = {
  error: unknown;
  source: MangaSource;
};

const {
  renderItem: renderItem,
  keyExtractor,
  ListEmptyComponent: ListLoadingComponent,
  getItemLayout,
  useColumns,
  contentContainerStyle,
} = Manga.generateFlatListProps({ flexibleColumns: true });

export default function SourceBrowser(props: RootStackProps<'SourceBrowser'>) {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const source = MangaSource.getSource(props.route.params.source);
  const numColumns = useColumns();
  const ready = useLoadAfterInteractions();
  const bottomSheet = React.useRef<BottomSheet>(null);
  const { input, setInput } = useUserInput(props.route.params.initialQuery);
  const [filters, setFilters, appliedFilters, finalizeFilters] =
    useFilters(source);
  const {
    data,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    error,
    isFetchedAfterMount,
  } = useMangaSearchQuery({ source, input, filters: appliedFilters });
  const collapsible = useSourceBrowserHeader({
    source,
    onUserInput: setInput,
    defaultInput: input,
    ref: bottomSheet,
  });

  function handleOnApplyFilters() {
    finalizeFilters();
    bottomSheet.current?.close();
  }

  function ListEmptyComponent() {
    if (isLoading || !ready) return <ListLoadingComponent />;
    return null;
  }

  function ListFooterComponent() {
    if (error != null)
      return (
        <>
          <Text color="textSecondary" bold>
            {source.NAME} responded with the following error:
          </Text>
          <Text color="textSecondary" variant="body2">
            {getErrorMessage(error.error)}
          </Text>
        </>
      );
    if (isFetchingNextPage) return <ListLoadingComponent />;
    if (!hasNextPage && data != null && ready)
      return (
        <Text
          color="textSecondary"
          alignment="center"
          bold
          style={style.footer}
        >
          No more results
        </Text>
      );
    return null;
  }

  function handleOnEndReached() {
    if (data != null && hasNextPage && isFetchedAfterMount) {
      fetchNextPage();
    }
  }

  return (
    <Manga.SourceProvider source={source}>
      <Screen.FlatList
        initialNumToRender={12}
        maxToRenderPerBatch={9}
        updateCellsBatchingPeriod={1000}
        key={numColumns}
        collapsible={collapsible}
        contentContainerStyle={contentContainerStyle}
        data={ready && error == null ? data?.pages : []}
        numColumns={numColumns}
        getItemLayout={getItemLayout}
        ListEmptyComponent={ListEmptyComponent}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={1}
        onEndReached={handleOnEndReached}
        ListFooterComponent={ListFooterComponent}
      />
      <React.Suspense>
        <SourceFilters
          filters={filters}
          onApplyFilters={handleOnApplyFilters}
          setFilters={setFilters}
          ref={bottomSheet}
        />
      </React.Suspense>
    </Manga.SourceProvider>
  );
}
