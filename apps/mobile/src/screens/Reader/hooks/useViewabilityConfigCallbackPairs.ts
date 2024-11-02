import { MangaChapter } from '@mangayomu/mangascraper';
import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { Data, Indices } from '@/screens/Reader/Reader';
import { PageProps } from '@/screens/Reader/components/ui/Page';
import { FetchAheadBehavior, useSettingsStore } from '@/stores/settings';

type UseViewabilityConfigCallbackPairsParams = {
  setCurrentChapter: React.Dispatch<React.SetStateAction<MangaChapter>>;
  dataLength: React.MutableRefObject<number>;
  fetchPreviousPage: () => void;
  fetchNextPage: () => void;
  indices: Indices;
};

export default function useViewabilityConfigCallbackPairs(
  params: UseViewabilityConfigCallbackPairsParams,
) {
  const {
    setCurrentChapter,
    dataLength,
    fetchNextPage,
    fetchPreviousPage,
    indices,
  } = params;
  const [currentPage, setCurrentPage] = React.useState<PageProps | null>(null);

  const handleOnFetchAhead = (page: PageProps, index: number | null) => {
    const { fetchAheadBehavior, fetchAheadPageOffset } =
      useSettingsStore.getState().reader;
    const [start, end] = indices.current[page.chapter.link];

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
            break;
          case 'CHAPTER_DIVIDER':
            if (viewable.index === dataLength.current - 1) {
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
