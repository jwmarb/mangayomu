import { useLocalRealm } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import { MangaSchema } from '@database/schemas/Manga';
import useBoolean from '@hooks/useBoolean';
import useMutableObject from '@hooks/useMutableObject';
import useUserHistory from '@hooks/useUserHistory';
import { Page } from '@redux/slices/reader';
import usePageLayout from '@screens/Reader/hooks/usePageLayout';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

export default function useSavedChapterInfo(
  args: Pick<ReturnType<typeof usePageLayout>, 'getSafeScrollRange'> & {
    horizontal: boolean;
    chapter: ChapterSchema & Realm.Object<ChapterSchema, never>;
    manga: MangaSchema & Realm.Object<MangaSchema, never>;
    scrollRef: React.RefObject<FlashList<Page>>;
    incognito: boolean;
    pages: Page[];
  },
) {
  const {
    getSafeScrollRange,
    horizontal,
    chapter,
    scrollRef,
    pages,
    incognito,
    manga,
  } = args;
  const { addMangaToHistory } = useUserHistory({ incognito });
  const localRealm = useLocalRealm();
  const scrollOffset = React.useRef<number>(0);
  const shouldSaveScrollOffset = React.useRef<boolean>(false);
  const chapterRef = useMutableObject(chapter);
  const [isFinishedInitialScrollOffset, setIsFinishedInitialScrollOffset] =
    useBoolean();

  React.useEffect(() => {
    addMangaToHistory({
      manga: {
        imageCover: manga.imageCover,
        index: manga.index,
        link: manga.link,
        source: manga.source,
        title: manga.title,
      },
      chapter: {
        date: chapter.date,
        index: chapter.index,
        link: chapter.link,
        name: chapter.name,
      },
    });
  }, [chapter._id]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollOffset.current =
      event.nativeEvent.contentOffset[horizontal ? 'x' : 'y'];
  };

  const saveScrollPosition = () => {
    if (shouldSaveScrollOffset.current) {
      const [min, max] = getSafeScrollRange();
      const interpolatedScrollOffset = Math.min(
        Math.max(min, scrollOffset.current),
        max,
      );
      localRealm.write(() => {
        localRealm.create(
          ChapterSchema,
          {
            _id: chapterRef.current._id,
            scrollPosition: interpolatedScrollOffset,
          },
          Realm.UpdateMode.Modified,
        );
      });
    }
  };

  React.useEffect(() => {
    if (pages.length > 0) {
      const scrollOffsetReturner = setInterval(() => {
        scrollRef.current?.scrollToOffset({
          offset: chapter.scrollPosition,
          animated: false,
        });
        if (Math.abs(scrollOffset.current - chapter.scrollPosition) <= 1) {
          shouldSaveScrollOffset.current = true;
          setIsFinishedInitialScrollOffset(true);
          clearInterval(scrollOffsetReturner);
        }
      }, 1);

      const scrollTracker = setInterval(() => {
        saveScrollPosition();
      }, 500);

      return () => {
        // clearInterval(scrollOffsetReturner);
        clearInterval(scrollTracker);
      };
    }
  }, [pages.length > 0]);

  return { onScroll, isFinishedInitialScrollOffset };
}
