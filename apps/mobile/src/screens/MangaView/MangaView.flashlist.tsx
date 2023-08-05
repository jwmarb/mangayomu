/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FlashListProps, ListRenderItem } from '@shopify/flash-list';
import { ChapterSchema } from '@database/schemas/Chapter';
import RowChapter from '@screens/MangaView/components/RowChapter';
import { ROW_CHAPTER_HEIGHT } from '@screens/MangaView/components/RowChapter/RowChapter';
import { DIVIDER_DEPTH } from '@theme/constants';
import { LocalChapterSchema } from '@database/schemas/LocalChapter';
import { IMangaSchema } from '@mangayomu/schemas';

export const keyExtractor = (item: LocalChapterSchema) => item._id;

export const overrideItemLayout: FlashListProps<LocalChapterSchema>['overrideItemLayout'] =
  (layout) => {
    layout.size = ROW_CHAPTER_HEIGHT + DIVIDER_DEPTH;
  };

export const renderItem: ListRenderItem<LocalChapterSchema> = (info) => {
  const { item } = info;
  const extra = info.extraData as {
    mangaLink?: string;
    currentlyReadingChapterId?: string;
  };
  return (
    <RowChapter
      mangaKey={extra.mangaLink}
      name={item.name}
      date={item.date}
      chapterKey={item._id}
      isReading={extra.currentlyReadingChapterId === item._id}
    />
  );
};
