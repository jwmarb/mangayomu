import { useRealm } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import { MangaSchema } from '@database/schemas/Manga';
import { useAppDispatch } from '@redux/main';
import { Page, setCurrentChapter } from '@redux/slices/reader';
import { PageSliderNavigatorMethods } from '@screens/Reader/components/Overlay/components/PageSliderNavigator/PageSliderNavigator.interfaces';
import useCancellable from './useCancellable';
import React from 'react';
import { ViewToken, ViewabilityConfigCallbackPairs } from 'react-native';
import useChapterFetcher from '@screens/Reader/hooks/useChapterFetcher';
import { runOnJS } from 'react-native-reanimated';
import { LocalChapterSchema } from '@database/schemas/LocalChapter';
import { CombinedMangaWithLocal } from '@hooks/useCombinedMangaWithLocal';

export default function useViewableItemsChangedHandler(args: {
  manga: CombinedMangaWithLocal;
  chapter: LocalChapterSchema;
  pageSliderNavRef: React.RefObject<PageSliderNavigatorMethods>;
  pages: Page[];
  fetchPagesByChapter: ReturnType<typeof useChapterFetcher>;
  showOverlay: () => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  cancellable: ReturnType<typeof useCancellable>[0];
}) {
  const {
    manga,
    pageSliderNavRef,
    fetchPagesByChapter,
    cancellable,
    setCurrentPage,
    showOverlay,
  } = args;
  const dispatch = useAppDispatch();

  const realm = useRealm();
  const handleOnViewableItemsChanged = (info: {
    viewableItems: ViewToken[];
    changed: ViewToken[];
  }) => {
    const page = info.viewableItems[0];
    if (page != null) {
      const item = page.item as Page;

      switch (item.type) {
        case 'PAGE':
          {
            const chapter = realm.objectForPrimaryKey(
              ChapterSchema,
              item.chapter,
            );

            manga.update((draft) => {
              if (chapter?.numberOfPages != null)
                draft.currentlyReadingChapter = {
                  _id: item.chapter,
                  index: item.pageNumber - 1,
                  numOfPages: chapter.numberOfPages,
                };
            });

            realm.write(() => {
              if (chapter != null) chapter.indexPage = item.pageNumber - 1;
            });
            setCurrentPage(item.pageNumber);
            dispatch(setCurrentChapter(item.chapter));
            pageSliderNavRef.current?.snapPointTo(item.pageNumber - 1);
          }
          break;
        case 'TRANSITION_PAGE':
          cancellable(fetchPagesByChapter, item);
          break;
        case 'NO_MORE_PAGES':
          runOnJS(showOverlay)();
          break;
      }
    }
  };

  const viewabilityConfigCallbackPairs =
    React.useRef<ViewabilityConfigCallbackPairs>([
      {
        onViewableItemsChanged: handleOnViewableItemsChanged,
        viewabilityConfig: {
          viewAreaCoveragePercentThreshold: 99,
          waitForInteraction: false,
          minimumViewTime: 0,
        },
      },
    ]);

  return viewabilityConfigCallbackPairs;
}
