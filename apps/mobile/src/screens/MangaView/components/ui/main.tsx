import React from 'react';
import { RefreshControl } from 'react-native-gesture-handler';
import { ListRenderItem } from 'react-native';
import ListFooterComponent from '@/screens/MangaView/components/ui/footer';
import ListEmptyComponent from '@/screens/MangaView/components/ui/empty';
import ListHeaderComponent from '@/screens/MangaView/components/ui/details';
import useMangaMeta from '@/screens/MangaView/hooks/useMangaMeta';
import Chapter from '@/screens/MangaView/components/primitives/Chapter';
import useMangaSource from '@/hooks/useMangaSource';
import { isChapter } from '@/utils/helpers';
import useItemLayout from '@/screens/MangaView/hooks/useItemLayout';
import Screen from '@/components/primitives/Screen';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';

export type MangaViewMainProps = {
  unparsedManga: unknown;
  source?: string;
  chapters: unknown[];
  onEndReached: () => void;
  collapsible: ReturnType<typeof useCollapsibleHeader>;
};

const renderItem: ListRenderItem<unknown> = ({ item }) => (
  <Chapter chapter={item} />
);

export default function MangaViewMain(props: MangaViewMainProps) {
  const {
    unparsedManga,
    source: sourceStr,
    chapters,
    onEndReached,
    collapsible,
  } = props;
  const { data, refetch, isFetching } = useMangaMeta(unparsedManga, sourceStr);
  const meta = data?.[1];
  const source = useMangaSource({ manga: unparsedManga, source: sourceStr });

  const keyExtractor = React.useCallback(
    (chapter: unknown) =>
      isChapter(chapter) ? chapter.link : source.toChapter(chapter, meta).link,
    [source, meta],
  );

  const getItemLayout = useItemLayout(source, meta);

  const handleOnRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  const refreshControl = React.useMemo(
    () => (
      <RefreshControl refreshing={isFetching} onRefresh={handleOnRefresh} />
    ),
    [isFetching, refetch],
  );

  return (
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
  );
}
