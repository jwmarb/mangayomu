import { ExtendedReaderPageState, Page } from '@redux/slices/reader/reader';
import React from 'react';
import { ListRenderItem } from '@shopify/flash-list';
import TransitionPage from '@screens/Reader/components/TransitionPage/TransitionPage';
import ChapterPage from '@screens/Reader/components/ChapterPage/ChapterPage';
import NoMorePages from '@screens/Reader/components/NoMorePages/NoMorePages';
import ChapterError from '@screens/Reader/components/ChapterError/ChapterError';
import usePageLayout from '@screens/Reader/hooks/usePageLayout';
import { ReadingDirection } from '@redux/slices/settings';

const renderItem: ListRenderItem<Page> = (info) => {
  const { item } = info;
  const extraData = info.extraData as {
    extendedState: Record<string, ExtendedReaderPageState | undefined>;
    readingDirection: ReadingDirection;
  };
  switch (item.type) {
    case 'PAGE':
      return (
        <ChapterPage
          page={item}
          extendedPageState={extraData.extendedState[item.page]}
        />
      );
    case 'TRANSITION_PAGE':
      return <TransitionPage page={item} />;
    case 'NO_MORE_PAGES':
      return <NoMorePages />;
    case 'CHAPTER_ERROR':
      return <ChapterError data={item} />;
  }
};

const keyExtractor = (p: Page) => {
  switch (p.type) {
    case 'PAGE':
      return `${p.page}.${p.pageNumber}`;
    case 'TRANSITION_PAGE':
      return `${p.previous._id}${p.next._id}`;
    case 'CHAPTER_ERROR':
      return `error-${p.current._id}`;
    case 'NO_MORE_PAGES':
      return 'no more pages';
  }
};

const getItemType: (
  item: Page,
  index: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extraData?: any,
) => string | number | undefined = (item) => item.type;

export default function useFlashList(args: {
  getPageOffset: ReturnType<typeof usePageLayout>['getPageOffset'];
}) {
  const overrideItemLayout: (
    layout: {
      span?: number | undefined;
      size?: number | undefined;
    },
    item: Page,
    index: number,
    maxColumns: number,
    extraData?: any,
  ) => void = (layout, item) => {
    layout.size = args.getPageOffset(item);
  };
  return {
    getItemType,
    renderItem,
    overrideItemLayout,
    keyExtractor,
  };
}
