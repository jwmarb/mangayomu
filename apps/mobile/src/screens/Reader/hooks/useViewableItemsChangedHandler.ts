import { useRealm } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import { useAppDispatch } from '@redux/main';
import { Page, setCurrentChapter, setCurrentPage } from '@redux/slices/reader';
import { PageSliderNavigatorMethods } from '@screens/Reader/components/Overlay/components/PageSliderNavigator/';
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
    setCurrentPage: setCurrentPageNumber,
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
              item.chapterId,
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
            setCurrentPageNumber(item.pageNumber);
            dispatch(
              setCurrentChapter({ link: item.chapter, id: item.chapterId }),
            );
            dispatch(setCurrentPage(item.page));
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
