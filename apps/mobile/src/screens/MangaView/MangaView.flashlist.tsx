/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { IMangaSchema } from '@database/schemas/Manga';
import { FlashListProps, ListRenderItem } from '@shopify/flash-list';
import { ChapterSchema } from '@database/schemas/Chapter';
import RowChapter from '@screens/MangaView/components/RowChapter';
import { ROW_CHAPTER_HEIGHT } from '@screens/MangaView/components/RowChapter/RowChapter';
import { DIVIDER_DEPTH } from '@theme/constants';

export const keyExtractor = (item: ChapterSchema) => item._id;

export const overrideItemLayout: FlashListProps<ChapterSchema>['overrideItemLayout'] =
  (layout) => {
    layout.size = ROW_CHAPTER_HEIGHT + DIVIDER_DEPTH;
  };

export const renderItem: ListRenderItem<ChapterSchema> = (info) => {
  const { item } = info;
  const extra = info.extraData as {
    manga: IMangaSchema | undefined;
  };
  return (
    <RowChapter
      mangaKey={extra.manga?._id}
      dateRead={item.dateRead}
      name={item.name}
      indexPage={item.indexPage}
      numberOfPages={item.numberOfPages}
      date={item.date}
      chapterKey={item._id}
      isReading={extra.manga?.currentlyReadingChapter?._id === item._id}
    />
  );
};
