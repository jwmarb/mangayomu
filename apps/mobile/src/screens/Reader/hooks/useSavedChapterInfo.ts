import { useRealm } from '@database/main';
import { ChapterSchema, IChapterSchema } from '@database/schemas/Chapter';
import { LocalChapterSchema } from '@database/schemas/LocalChapter';
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
    savedChapterInfo: ChapterSchema;
    chapter: LocalChapterSchema;
    manga: MangaSchema;
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
    savedChapterInfo,
  } = args;
  const { addMangaToHistory } = useUserHistory({ incognito });
  const savedScrollPosition = useMutableObject(savedChapterInfo.scrollPosition);
  const realm = useRealm();
  const scrollOffset = React.useRef<number>(0);
  const shouldSaveScrollOffset = React.useRef<boolean>(false);
  const chapterRef = useMutableObject(chapter);
  const [isFinishedInitialScrollOffset, setIsFinishedInitialScrollOffset] =
    useBoolean();

  React.useEffect(() => {
    realm.write(() => {
      savedChapterInfo.dateRead = Date.now();
    });
    addMangaToHistory({
      manga: {
        imageCover: manga.imageCover,
        link: manga._id,
        source: manga.source,
        title: manga.title,
      },
      chapter: {
        date: chapter.date,
        index: chapter.index,
        link: chapter._id,
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
      realm.write(() => {
        realm.create(
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
      const [min, max] = getSafeScrollRange();
      const scrollOffsetReturner = setInterval(() => {
        if (
          savedScrollPosition.current == null ||
          savedScrollPosition.current < min ||
          savedScrollPosition.current > max
        ) {
          shouldSaveScrollOffset.current = true;
          setIsFinishedInitialScrollOffset(true);
          clearInterval(scrollOffsetReturner);
          return;
        }
        scrollRef.current?.scrollToOffset({
          offset: savedScrollPosition.current,
          animated: false,
        });
        if (Math.abs(scrollOffset.current - savedScrollPosition.current) <= 1) {
          shouldSaveScrollOffset.current = true;
          setIsFinishedInitialScrollOffset(true);
          clearInterval(scrollOffsetReturner);
        }
      }, 20);

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
