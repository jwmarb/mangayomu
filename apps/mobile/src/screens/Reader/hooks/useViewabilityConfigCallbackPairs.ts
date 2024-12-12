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

/**
 *  Generates a configuration for viewability callbacks used in a FlatList component.
 *  The configuration includes logic to handle fetching the next or previous page based on
 *  the current viewable items and their positions within the list.
 *
 *  @pre    The params object must contain valid functions for fetchNextPage and fetchPreviousPage.
 *  @post   The viewabilityConfigCallbackPairs and currentPage are returned, ready to be used in a FlatList.
 *  @param params   An object containing:
 *                  - fetchNextPage: A function to fetch the next page of content.
 *                  - fetchPreviousPage: A function to fetch the previous page of content.
 *
 *  @returns An object containing:
 *           - viewabilityConfigCallbackPairs: A configuration for viewability callbacks.
 *           - currentPage: The current page being viewed, represented as a PageProps object.
 */
export default function useViewabilityConfigCallbackPairs(
  params: UseViewabilityConfigCallbackPairsParams,
) {
  const { fetchNextPage, fetchPreviousPage } = params;
  // Retrieve the setCurrentChapter function from the useCurrentChapter hook.
  const setCurrentChapter = useCurrentChapter(
    (selector) => selector.setCurrentChapter,
  );
  // Initialize state to keep track of the current page.
  const [currentPage, setCurrentPage] = React.useState<PageProps | null>(null);

  // Function to handle fetching the next page based on the current page and index.
  const handleOnFetchAhead = (page: PageProps, index: number | null) => {
    // Retrieve fetchAheadBehavior and fetchAheadPageOffset from the settings store.
    const { fetchAheadBehavior, fetchAheadPageOffset } =
      useSettingsStore.getState().reader;
    // Get the start and end boundaries of the current chapter.
    const [start, end] = ExtraReaderInfo.getPageBoundaries(page.chapter);

    // Check if the index is not null and the next page has not been fetched yet.
    if (index != null && ExtraReaderInfo.isNextFetched(page.chapter)) {
      // Determine the fetch ahead behavior based on the settings.
      switch (fetchAheadBehavior) {
        case FetchAheadBehavior.IMMEDIATELY:
          // Fetch the next page immediately.
          fetchNextPage();
          break;
        case FetchAheadBehavior.FROM_END:
          // Fetch the next page when the current index reaches the end minus the offset.
          if (index === end - fetchAheadPageOffset) {
            fetchNextPage();
          }
          break;
        case FetchAheadBehavior.FROM_START:
          // Fetch the next page when the current index reaches the start plus the offset.
          if (index === start + fetchAheadPageOffset) {
            fetchNextPage();
          }
          break;
      }
    }
  };

  // Create a ref to store the viewabilityConfigCallbackPairs for the FlatList.
  const viewabilityConfigCallbackPairs = React.useRef<
    React.ComponentProps<typeof FlatList>['viewabilityConfigCallbackPairs']
  >([
    {
      // Callback function to handle changes in viewable items.
      onViewableItemsChanged: ({ viewableItems }) => {
        // If there are no viewable items, return early.
        if (viewableItems.length === 0) {
          return;
        }

        // Get the first viewable item.
        const viewable = viewableItems[0];
        const item = viewable.item as Data;
        // Handle different types of viewable items.
        switch (item.type) {
          case 'PAGE':
            // Update the current page and chapter, handle fetch ahead, and set the current page in GestureManager.
            setCurrentPage(item);
            setCurrentChapter(item.chapter);
            handleOnFetchAhead(item, viewable.index);
            GestureManager.setCurrentPage(item.source);
            break;
          case 'CHAPTER_DIVIDER':
            // Fetch the next page if the viewable index is at the end, or fetch the previous page if at the start.
            if (ExtraReaderInfo.isAtEnd(viewable.index)) {
              fetchNextPage();
            } else if (viewable.index === 0) {
              fetchPreviousPage();
            }
            break;
        }
      },
      // Configuration for viewability.
      viewabilityConfig: {
        // Do not wait for user interaction to start checking for viewability.
        waitForInteraction: false,
        // Consider an item viewable if 99% of it is visible.
        viewAreaCoveragePercentThreshold: 99,
      },
    },
  ]);
  // Return the viewabilityConfigCallbackPairs and the current page.
  return { viewabilityConfigCallbackPairs, currentPage };
}
