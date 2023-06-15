import { useLocalRealm } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import useBoolean from '@hooks/useBoolean';
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
    scrollRef: React.RefObject<FlashList<Page>>;
    pages: Page[];
  },
) {
  const { getSafeScrollRange, horizontal, chapter, scrollRef, pages } = args;
  const localRealm = useLocalRealm();
  const scrollOffset = React.useRef<number>(0);
  const shouldSaveScrollOffset = React.useRef<boolean>(false);
  const [isFinishedInitialScrollOffset, setIsFinishedInitialScrollOffset] =
    useBoolean();

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollOffset.current =
      event.nativeEvent.contentOffset[horizontal ? 'x' : 'y'];
  };

  const saveScrollPosition = () => {
    if (shouldSaveScrollOffset.current) {
      const [min, max] = getSafeScrollRange();
      const { width, height } = Dimensions.get('window');
      const interpolatedScrollOffset = Math.min(
        Math.max(min, scrollOffset.current),
        max,
      );

      localRealm.write(() => {
        chapter.scrollPosition = interpolatedScrollOffset;
        chapter.savedScrollPositionType =
          height > width ? 'portrait' : 'landscape';
      });
    }
  };

  React.useEffect(() => {
    if (pages.length === 0) {
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
      }, 15);

      const scrollTracker = setInterval(() => {
        saveScrollPosition();
      }, 500);

      return () => {
        clearInterval(scrollOffsetReturner);
        clearInterval(scrollTracker);
      };
    }
  }, [pages.length === 0]);

  return { onScroll, isFinishedInitialScrollOffset };
}
