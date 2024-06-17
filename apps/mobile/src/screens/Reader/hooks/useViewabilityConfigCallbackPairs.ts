import { MangaChapter } from '@mangayomu/mangascraper';
import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { Data } from '@/screens/Reader/Reader';

type UseViewabilityConfigCallbackPairsParams = {
  setCurrentChapter: React.Dispatch<React.SetStateAction<MangaChapter | null>>;
  dataLength: React.MutableRefObject<number>;
  fetchPreviousPage: () => void;
  fetchNextPage: () => void;
};

export default function useViewabilityConfigCallbackPairs(
  params: UseViewabilityConfigCallbackPairsParams,
) {
  const { setCurrentChapter, dataLength, fetchNextPage, fetchPreviousPage } =
    params;
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
            setCurrentChapter(item.chapter);
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
        viewAreaCoveragePercentThreshold: 100,
      },
    },
  ]);
  return viewabilityConfigCallbackPairs;
}
