import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { ListRenderItem, View } from 'react-native';
import { MangaChapter } from '@mangayomu/mangascraper';
import useMangaMeta from '@/screens/MangaView/hooks/useMangaMeta';
import { RootStackProps } from '@/screens/navigator';
import Progress from '@/components/primitives/Progress';
import useStyles from '@/hooks/useStyles';
import { styles } from '@/screens/Reader/styles';
import useContrast from '@/hooks/useContrast';
import ChapterDivider, {
  ChapterDividerProps,
} from '@/screens/Reader/components/ChapterDivider';
import useCurrentChapter from '@/screens/Reader/hooks/useCurrentChapter';
import {
  CurrentChapterContext,
  IsFetchingChapterContext,
} from '@/screens/Reader/context';
import usePages from '@/screens/Reader/hooks/usePages';
import useViewabilityConfigCallbackPairs from '@/screens/Reader/hooks/useViewabilityConfigCallbackPairs';
import useItemLayout from '@/screens/Reader/hooks/useItemLayout';
import NoMoreChapters from '@/screens/Reader/components/NoMoreChapters';
import Page from '@/screens/Reader/components/Page';

export type Data =
  | { type: 'PAGE'; source: { uri: string }; chapter: MangaChapter }
  | ChapterDividerProps
  | { type: 'NO_MORE_CHAPTERS' };

export type Query = { pages: string[]; chapter: MangaChapter };

const renderItem: ListRenderItem<Data> = ({ item }) => {
  switch (item.type) {
    case 'CHAPTER_DIVIDER':
      return <ChapterDivider {...item} />;
    case 'NO_MORE_CHAPTERS':
      return <NoMoreChapters />;
    case 'PAGE':
      return <Page {...item} />;
  }
};

const keyExtractor = (i: Data) => {
  switch (i.type) {
    case 'CHAPTER_DIVIDER':
      if (i.next && i.previous) {
        return i.next?.link + i.previous?.link;
      }
      if (i.next) {
        return 'next';
      }
      if (i.previous) {
        return 'previous';
      }
      return 'undefined';
    case 'NO_MORE_CHAPTERS':
      return i.type;
    case 'PAGE':
      return i.source.uri;
  }
};

const maintainVisibleContentPosition = { minIndexForVisible: 1 };

export default function Reader(props: RootStackProps<'Reader'>) {
  const {
    route: {
      params: { manga, source: sourceStr, chapter },
    },
  } = props;

  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const { data: metaResult } = useMangaMeta(manga, sourceStr);
  const [tmangameta, meta] = metaResult ?? [];
  const [currentChapter, setCurrentChapter] = useCurrentChapter({
    chapter,
    source: sourceStr,
    manga,
    tmangameta,
  });
  const {
    query: { isFetching, isLoading, fetchNextPage, fetchPreviousPage, data },
    initialPageParam,
    dataLength,
  } = usePages({
    manga,
    chapter,
    source: sourceStr,
    currentChapter,
    tmangameta,
    meta,
  });

  const viewabilityConfigCallbackPairs = useViewabilityConfigCallbackPairs({
    dataLength,
    fetchNextPage,
    fetchPreviousPage,
    setCurrentChapter,
  });

  const getItemLayout = useItemLayout();

  if (isLoading || currentChapter == null) {
    return (
      <View style={style.loadingContainer}>
        <Progress size="large" />
      </View>
    );
  }

  return (
    <IsFetchingChapterContext.Provider value={isFetching}>
      <CurrentChapterContext.Provider value={currentChapter}>
        <FlatList
          getItemLayout={getItemLayout}
          maintainVisibleContentPosition={maintainVisibleContentPosition}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          data={data?.pages}
          viewabilityConfigCallbackPairs={
            viewabilityConfigCallbackPairs.current
          }
          horizontal
          pagingEnabled
          initialScrollIndex={initialPageParam === 0 ? 0 : 1}
        />
      </CurrentChapterContext.Provider>
    </IsFetchingChapterContext.Provider>
  );
}
