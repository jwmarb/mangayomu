import { MangaChapter } from '@mangayomu/mangascraper';
import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { Data } from '@/screens/Reader/Reader';
import { PageProps } from '@/screens/Reader/components/ui/Page';
import { FetchAheadBehavior, useSettingsStore } from '@/stores/settings';
import ExtraReaderInfo from '@/screens/Reader/helpers/ExtraReaderInfo';
import { useCurrentChapter } from '@/screens/Reader/stores/chapter';
import GestureManager from '@/screens/Reader/helpers/GestureManager';

type UseViewabilityConfigCallbackPairsParams = {
  fetchPreviousPage: () => void;
  fetchNextPage: () => void;
};

export default function useViewabilityConfigCallbackPairs(
  params: UseViewabilityConfigCallbackPairsParams,
) {
  const { fetchNextPage, fetchPreviousPage } = params;
  const setCurrentChapter = useCurrentChapter(
    (selector) => selector.setCurrentChapter,
  );
  const [currentPage, setCurrentPage] = React.useState<PageProps | null>(null);

  const handleOnFetchAhead = (page: PageProps, index: number | null) => {
    const { fetchAheadBehavior, fetchAheadPageOffset } =
      useSettingsStore.getState().reader;
    const [start, end] = ExtraReaderInfo.getPageBoundaries(page.chapter);

    if (index != null && ExtraReaderInfo.isNextFetched(page.chapter)) {
      switch (fetchAheadBehavior) {
        case FetchAheadBehavior.IMMEDIATELY:
          fetchNextPage();
          break;
        case FetchAheadBehavior.FROM_END:
          if (index === end - fetchAheadPageOffset) {
            fetchNextPage();
          }
          break;
        case FetchAheadBehavior.FROM_START:
          if (index === start + fetchAheadPageOffset) {
            fetchNextPage();
          }
          break;
      }
    }
  };

  const viewabilityConfigCallbackPairs = React.useRef<
    React.ComponentProps<typeof FlatList>['viewabilityConfigCallbackPairs']
  >([
    {
      onViewableItemsChanged: ({ viewableItems }) => {
        if (viewableItems.length === 0) {
          return;
        }

        const viewable = viewableItems[0];
        const item = viewable.item as Data;
        switch (item.type) {
          case 'PAGE':
            setCurrentPage(item);
            setCurrentChapter(item.chapter);
            handleOnFetchAhead(item, viewable.index);
            GestureManager.setCurrentPage(item.source);
            break;
          case 'CHAPTER_DIVIDER':
            if (ExtraReaderInfo.isAtEnd(viewable.index)) {
              fetchNextPage();
            } else if (viewable.index === 0) {
              fetchPreviousPage();
            }
            break;
        }
      },
      viewabilityConfig: {
        waitForInteraction: false,
        viewAreaCoveragePercentThreshold: 99,
      },
    },
  ]);
  return { viewabilityConfigCallbackPairs, currentPage };
}
