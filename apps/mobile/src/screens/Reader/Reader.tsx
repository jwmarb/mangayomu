import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { MangaChapter } from '@mangayomu/mangascraper';
import useMangaMeta from '@/screens/MangaView/hooks/useMangaMeta';
import { RootStackProps } from '@/screens/navigator';
import Progress from '@/components/primitives/Progress';
import useStyles from '@/hooks/useStyles';
import { styles } from '@/screens/Reader/styles';
import useContrast from '@/hooks/useContrast';
import type { ChapterDividerProps } from '@/screens/Reader/components/ui/ChapterDivider';
import useCurrentChapter from '@/screens/Reader/hooks/useCurrentChapter';
import {
  CurrentChapterProvider,
  CurrentPageNumber,
  IsFetchingChapterProvider,
  PageBoundariesProvider,
  ReaderBackgroundColor,
  ReaderFlatListRefProvider,
  ReaderMangaProvider,
  ReadingDirectionProvider,
} from '@/screens/Reader/context';
import usePages from '@/screens/Reader/hooks/usePages';
import useViewabilityConfigCallbackPairs from '@/screens/Reader/hooks/useViewabilityConfigCallbackPairs';
import Overlay from '@/screens/Reader/components/ui/Overlay';
import useManga from '@/hooks/useManga';
import useBackgroundColor from '@/screens/Reader/hooks/useBackgroundColor';
import type { PageProps } from '@/screens/Reader/components/ui/Page';
import useReaderSetting from '@/hooks/useReaderSetting';
import { ReadingDirection } from '@/models/schema';
import useHistoryEntry from '@/screens/Reader/hooks/useHistoryEntry';
import useChapterData from '@/screens/Reader/hooks/useChapterData';
import { ResolvedImageAsset } from '@/utils/image';
import Display from '@/screens/Reader/components/ui/Display';
import useDeviceOrientation from '@/screens/Reader/hooks/useDeviceOrientation';

export type Data =
  | PageProps
  | ChapterDividerProps
  | { type: 'NO_MORE_CHAPTERS' };

export type Query = { pages: ResolvedImageAsset[]; chapter: MangaChapter };

export type Indices = React.MutableRefObject<Record<string, [number, number]>>;

export default function Reader(props: RootStackProps<'Reader'>) {
  const {
    route: {
      params: { manga: unparsedManga, source: sourceStr, chapter },
    },
  } = props;
  const manga = useManga(unparsedManga, sourceStr);
  const contrast = useContrast();
  useDeviceOrientation(manga);
  const style = useStyles(styles, contrast);
  const { state: readingDirection } = useReaderSetting(
    'readingDirection',
    manga,
  );
  const { data: metaResult } = useMangaMeta(unparsedManga, sourceStr);
  const [tmangameta, meta] = metaResult ?? [];
  const [currentChapter, setCurrentChapter] = useCurrentChapter({
    chapter,
    source: sourceStr,
    manga: unparsedManga,
    tmangameta,
  });
  const flatListRef = React.useRef<FlatList>(null);
  const {
    query: { isFetching, isLoading, fetchNextPage, fetchPreviousPage, data },
    initialPageParam,
    dataLength,
    indices,
  } = usePages({
    manga: unparsedManga,
    chapter,
    source: sourceStr,
    currentChapter,
    tmangameta,
    meta,
  });

  const { viewabilityConfigCallbackPairs, currentPage } =
    useViewabilityConfigCallbackPairs({
      dataLength,
      fetchNextPage,
      fetchPreviousPage,
      setCurrentChapter,
      indices,
    });
  const [contentContainerStyle, backgroundColor] = useBackgroundColor(manga);

  useHistoryEntry(currentChapter);

  const { initialScrollIndex } = useChapterData(
    currentPage,
    currentChapter,
    manga,
    indices,
    initialPageParam,
  );

  const isReady =
    !isLoading && currentChapter != null && initialScrollIndex != null;

  return (
    <ReaderBackgroundColor value={backgroundColor}>
      <ReadingDirectionProvider value={readingDirection}>
        <CurrentPageNumber value={currentPage}>
          <ReaderFlatListRefProvider value={flatListRef}>
            <PageBoundariesProvider value={indices}>
              <IsFetchingChapterProvider value={isFetching}>
                <CurrentChapterProvider value={currentChapter}>
                  <ReaderMangaProvider value={manga}>
                    <Overlay>
                      <View style={style.loadingContainer}>
                        {isReady ? (
                          <Display
                            pages={data?.pages}
                            contentContainerStyle={contentContainerStyle}
                            manga={manga}
                            viewabilityConfigCallbackPairs={
                              viewabilityConfigCallbackPairs
                            }
                            initialScrollIndex={initialScrollIndex}
                          />
                        ) : (
                          <Progress size="large" />
                        )}
                      </View>
                    </Overlay>
                  </ReaderMangaProvider>
                </CurrentChapterProvider>
              </IsFetchingChapterProvider>
            </PageBoundariesProvider>
          </ReaderFlatListRefProvider>
        </CurrentPageNumber>
      </ReadingDirectionProvider>
    </ReaderBackgroundColor>
  );
}
