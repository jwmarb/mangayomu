import useReaderSetting from '@/hooks/useReaderSetting';
import { ReadingDirection } from '@/models/schema';
import ChapterDivider from '@/screens/Reader/components/ui/ChapterDivider';
import NoMoreChapters from '@/screens/Reader/components/ui/NoMoreChapters';
import Page from '@/screens/Reader/components/ui/Page';
import { useReaderFlatListRef } from '@/screens/Reader/context';
import useItemLayout from '@/screens/Reader/hooks/useItemLayout';
import { Data } from '@/screens/Reader/Reader';
import { Manga } from '@mangayomu/mangascraper';
import { ListRenderItem, ViewabilityConfigCallbackPairs } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

export type DisplayProps = {
  manga: Manga;
  contentContainerStyle: Record<string, unknown>;
  pages?: Data[];
  viewabilityConfigCallbackPairs: React.MutableRefObject<
    ViewabilityConfigCallbackPairs | undefined
  >;
  initialScrollIndex: number | null;
};

const maintainVisibleContentPosition = { minIndexForVisible: 1 };

const renderItem: ListRenderItem<Data> = ({ item }) => {
  switch (item.type) {
    case 'CHAPTER_DIVIDER':
      return <ChapterDivider {...item} />;
    case 'NO_MORE_CHAPTERS':
      return <NoMoreChapters />;
    case 'PAGE':
      return <Page {...item} />;
  }
};

const keyExtractor = (i: Data) => {
  switch (i.type) {
    case 'CHAPTER_DIVIDER':
      if (i.next && i.previous) {
        return i.next?.link + i.previous?.link;
      }
      if (i.next) {
        return 'next';
      }
      if (i.previous) {
        return 'previous';
      }
      return 'undefined';
    case 'NO_MORE_CHAPTERS':
      return i.type;
    case 'PAGE':
      return i.source.uri;
  }
};

export default function Display(props: DisplayProps) {
  const {
    manga,
    contentContainerStyle,
    pages,
    viewabilityConfigCallbackPairs,
    initialScrollIndex,
  } = props;
  const { state: readingDirection } = useReaderSetting(
    'readingDirection',
    manga,
  );
  const flatListRef = useReaderFlatListRef();
  const getItemLayout = useItemLayout(readingDirection);

  /**
   * Determines whether or not the reader should be displayed in horizontal mode
   */
  const horizontal =
    readingDirection === ReadingDirection.RIGHT_TO_LEFT ||
    readingDirection === ReadingDirection.LEFT_TO_RIGHT;

  /**
   * Determines whether or not the reader should operate with reverse scrolling
   */
  const inverted = readingDirection === ReadingDirection.RIGHT_TO_LEFT;

  /**
   * Determines whether or not the reader should have pagination behavior
   */
  const pagingEnabled = readingDirection !== ReadingDirection.WEBTOON;

  return (
    <FlatList
      ref={flatListRef}
      contentContainerStyle={contentContainerStyle}
      getItemLayout={getItemLayout}
      maintainVisibleContentPosition={maintainVisibleContentPosition}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      data={pages}
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      horizontal={horizontal}
      inverted={inverted}
      pagingEnabled={pagingEnabled}
      showsHorizontalScrollIndicator={false}
      initialScrollIndex={initialScrollIndex}
    />
  );
}
