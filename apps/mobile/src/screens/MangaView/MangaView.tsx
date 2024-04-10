import React from 'react';
import { ListRenderItem, View } from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import Screen from '@/components/primitives/Screen';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';
import useManga from '@/hooks/useManga';
import useMangaSource from '@/hooks/useMangaSource';
import { RootStackProps } from '@/screens/navigator';
import { styles } from '@/screens/MangaView/styles';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';
import {
  MangaViewDataContext,
  MangaViewErrorContext,
  MangaViewFetchStatusContext,
  MangaViewMangaContext,
  MangaViewMangaSourceContext,
  MangaViewOpenFilterMenuContext,
} from '@/screens/MangaView/context';
import ListHeaderComponent from '@/screens/MangaView/details';
import Chapter from '@/screens/MangaView/components/primitives/Chapter';
import headerLeft from '@/screens/MangaView/components/header/headerLeft';
import headerRight from '@/screens/MangaView/components/header/headerRight';
import useItemLayout from '@/screens/MangaView/hooks/useItemLayout';
import BottomSheet from '@/components/composites/BottomSheet';
import { isChapter } from '@/utils/helpers';
import useMangaMeta from '@/screens/MangaView/hooks/useMangaMeta';
import FilterMenu from '@/screens/MangaView/components/composites/FilterMenu';
import useChapters from '@/screens/MangaView/hooks/useChapters';

const renderItem: ListRenderItem<unknown> = ({ item }) => (
  <Chapter chapter={item} />
);

export default function MangaView(props: RootStackProps<'MangaView'>) {
  const {
    route: {
      params: { manga: unparsedManga, source: sourceStr },
    },
  } = props;
  const source = useMangaSource({ manga: unparsedManga, source: sourceStr });
  const manga = useManga(unparsedManga, source);
  const { data, error, isFetching, refetch, fetchStatus } = useMangaMeta(props);
  const { chapters, onEndReached, isLoading } = useChapters(manga, data);

  const bottomSheet = React.useRef<BottomSheet>(null);
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const collapsible = useCollapsibleHeader(
    {
      showHeaderCenter: false,
      showBackButton: false,
      headerRightStyle: style.headerRight,
      headerLeft,
      headerRight,
      loading: isFetching,
    },
    [isFetching],
  );

  const openFilterMenu = React.useCallback(() => {
    bottomSheet.current?.open();
  }, []);

  const keyExtractor = React.useCallback(
    (chapter: unknown) =>
      isChapter(chapter) ? chapter.link : source.toChapter(chapter, data).link,
    [source, data],
  );

  const getItemLayout = useItemLayout(source, data);

  const handleOnRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  const refreshControl = React.useMemo(
    () => (
      <RefreshControl refreshing={isFetching} onRefresh={handleOnRefresh} />
    ),
    [isFetching, refetch],
  );

  const ListEmptyComponent = React.useCallback(() => {
    if (isLoading) {
      return (
        <>
          <Chapter.Skeleton />
          <Chapter.Skeleton />
          <Chapter.Skeleton />
          <Chapter.Skeleton />
          <Chapter.Skeleton />
          <Chapter.Skeleton />
          <Chapter.Skeleton />
          <Chapter.Skeleton />
        </>
      );
    }
    return null;
  }, [isLoading]);

  const ListFooterComponent = React.useCallback(() => {
    if (data != null && chapters.length < data.chapters.length) {
      return (
        <View style={style.contentContainerStyle}>
          <Chapter.Skeleton />
          <Chapter.Skeleton />
          <Chapter.Skeleton />
          <Chapter.Skeleton />
          <Chapter.Skeleton />
          <Chapter.Skeleton />
          <Chapter.Skeleton />
          <Chapter.Skeleton />
        </View>
      );
    }

    return <View style={style.contentContainerStyle} />;
  }, []);

  return (
    <MangaViewOpenFilterMenuContext.Provider value={openFilterMenu}>
      <MangaViewMangaContext.Provider value={manga}>
        <MangaViewDataContext.Provider value={data}>
          <MangaViewErrorContext.Provider value={error}>
            <MangaViewFetchStatusContext.Provider value={fetchStatus}>
              <MangaViewMangaSourceContext.Provider value={source}>
                <Screen.FlatList
                  ListEmptyComponent={ListEmptyComponent}
                  ListFooterComponent={ListFooterComponent}
                  refreshing={isFetching}
                  refreshControl={refreshControl}
                  initialNumToRender={0}
                  ignoreHeaderOffset
                  onEndReached={onEndReached}
                  onEndReachedThreshold={1}
                  ListHeaderComponent={ListHeaderComponent}
                  collapsible={collapsible}
                  data={chapters}
                  getItemLayout={getItemLayout}
                  renderItem={renderItem}
                  keyExtractor={keyExtractor}
                  windowSize={7}
                  maxToRenderPerBatch={13}
                />
                <FilterMenu ref={bottomSheet} />
              </MangaViewMangaSourceContext.Provider>
            </MangaViewFetchStatusContext.Provider>
          </MangaViewErrorContext.Provider>
        </MangaViewDataContext.Provider>
      </MangaViewMangaContext.Provider>
    </MangaViewOpenFilterMenuContext.Provider>
  );
}
