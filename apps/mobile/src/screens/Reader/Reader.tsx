import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { MangaChapter } from '@mangayomu/mangascraper';
import { RootStackProps } from '@/screens/navigator';
import Progress from '@/components/primitives/Progress';
import useStyles from '@/hooks/useStyles';
import { styles } from '@/screens/Reader/styles';
import useContrast from '@/hooks/useContrast';
import type { ChapterDividerProps } from '@/screens/Reader/components/ui/ChapterDivider';
import {
  CurrentPageNumber,
  IsFetchingChapterProvider,
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
import useHistoryEntry from '@/screens/Reader/hooks/useHistoryEntry';
import useChapterData from '@/screens/Reader/hooks/useChapterData';
import { ResolvedImageAsset } from '@/utils/image';
import Display from '@/screens/Reader/components/ui/Display';
import useDeviceOrientation from '@/screens/Reader/hooks/useDeviceOrientation';
import ExtraReaderInfo from '@/screens/Reader/helpers/ExtraReaderInfo';
import useReaderMangaMeta from '@/screens/Reader/hooks/useReaderMangaMeta';
import { useCurrentChapter } from '@/screens/Reader/stores/chapter';
import GestureManager from '@/screens/Reader/helpers/GestureManager';

export type Data =
  | PageProps
  | ChapterDividerProps
  | { type: 'NO_MORE_CHAPTERS' };

export type Query = { pages: ResolvedImageAsset[]; chapter: MangaChapter };

export default function Reader(props: RootStackProps<'Reader'>) {
  const {
    route: {
      params: { manga: unparsedManga, source: sourceStr, chapter },
    },
  } = props;
  ExtraReaderInfo.setSource(sourceStr);
  GestureManager.createSharedGestures();
  const manga = useManga(unparsedManga, sourceStr);
  const contrast = useContrast();
  useDeviceOrientation(manga);
  const style = useStyles(styles, contrast);
  const { state: readingDirection } = useReaderSetting(
    'readingDirection',
    manga,
  );
  const isFetched = useReaderMangaMeta({ manga: unparsedManga, chapter });

  useCurrentChapter((selector) => selector.onInitialize)(chapter);
  const currentChapter = useCurrentChapter(
    (selector) => selector.currentChapter,
  );
  const flatListRef = React.useRef<FlatList>(null);
  const { isFetching, isLoading, fetchNextPage, fetchPreviousPage, data } =
    usePages({
      manga: unparsedManga,
    });

  const { viewabilityConfigCallbackPairs, currentPage } =
    useViewabilityConfigCallbackPairs({
      fetchNextPage,
      fetchPreviousPage,
    });
  const [contentContainerStyle, backgroundColor] = useBackgroundColor(manga);

  useHistoryEntry(manga);

  const { initialScrollIndex } = useChapterData(currentPage, manga);

  const isReady =
    !isLoading &&
    currentChapter != null &&
    initialScrollIndex != null &&
    isFetched;

  return (
    <ReaderBackgroundColor value={backgroundColor}>
      <ReadingDirectionProvider value={readingDirection}>
        <CurrentPageNumber value={currentPage}>
          <ReaderFlatListRefProvider value={flatListRef}>
            <IsFetchingChapterProvider value={isFetching}>
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
            </IsFetchingChapterProvider>
          </ReaderFlatListRefProvider>
        </CurrentPageNumber>
      </ReadingDirectionProvider>
    </ReaderBackgroundColor>
  );
}
