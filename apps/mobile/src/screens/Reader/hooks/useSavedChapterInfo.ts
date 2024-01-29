import { useRealm } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import { LocalChapterSchema } from '@database/schemas/LocalChapter';
import useAppSelector from '@hooks/useAppSelector';
import useBoolean from '@hooks/useBoolean';
import { CombinedMangaWithLocal } from '@hooks/useCombinedMangaWithLocal';
import useMutableObject from '@hooks/useMutableObject';
import useUserHistory from '@hooks/useUserHistory';
import { useUser } from '@realm/react';
import { Page } from '@redux/slices/reader';
import usePageLayout from '@screens/Reader/hooks/usePageLayout';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import {
  AppState,
  AppStateStatus,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import Realm from 'realm';

export default function useSavedChapterInfo(
  args: Pick<ReturnType<typeof usePageLayout>, 'getSafeScrollRange'> & {
    horizontal: boolean;
    savedChapterInfo: ChapterSchema;
    chapter: LocalChapterSchema;
    manga: CombinedMangaWithLocal;
    scrollRef: React.RefObject<FlashList<Page>>;
  },
) {
  const {
    getSafeScrollRange,
    horizontal,
    chapter,
    scrollRef,
    manga,
    savedChapterInfo,
  } = args;
  const incognito = useAppSelector((state) => state.settings.history.incognito);
  const pages = useAppSelector((state) => state.reader.pages);
  const { addMangaToHistory } = useUserHistory({ incognito });
  const savedScrollPosition = useMutableObject(savedChapterInfo.scrollPosition);
  const savedChapterInfoRef = useMutableObject(savedChapterInfo);
  const realm = useRealm();
  const user = useUser();
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
        link: manga.link,
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
      if (savedChapterInfoRef.current?.link === chapterRef.current._id)
        realm.write(() => {
          const cloudChapter = realm.objectForPrimaryKey(
            ChapterSchema,
            savedChapterInfoRef.current._id,
          );
          if (cloudChapter != null)
            cloudChapter.scrollPosition = interpolatedScrollOffset;
        });
      else
        console.warn(
          `Tried to save to ${chapterRef.current._id} but got a different corresponding id: ${savedChapterInfoRef.current?.link}`,
        );
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

      let scrollTracker: NodeJS.Timeout = setInterval(() => {
        saveScrollPosition();
      }, 500);
      const listener = AppState.addEventListener(
        'change',
        (state: AppStateStatus) => {
          switch (state) {
            case 'active':
              scrollTracker = setInterval(() => {
                saveScrollPosition();
              }, 500);
              break;
            default:
              clearInterval(scrollTracker);
              break;
          }
        },
      );

      return () => {
        // clearInterval(scrollOffsetReturner);
        clearInterval(scrollTracker);
        listener.remove();
      };
    }
  }, [pages.length > 0]);

  return { onScroll, isFinishedInitialScrollOffset };
}
