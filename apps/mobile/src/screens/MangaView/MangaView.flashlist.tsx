/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { IMangaSchema } from '@database/schemas/Manga';
import { FlashListProps, ListRenderItem } from '@shopify/flash-list';
import { ChapterSchema } from '@database/schemas/Chapter';
import RowChapter from '@screens/MangaView/components/RowChapter';
import { ROW_CHAPTER_HEIGHT } from '@screens/MangaView/components/RowChapter/RowChapter';
import { DIVIDER_DEPTH } from '@theme/constants';
import { LocalChapterSchema } from '@database/schemas/LocalChapter';

export const keyExtractor = (item: LocalChapterSchema) => item._id;

export const overrideItemLayout: FlashListProps<LocalChapterSchema>['overrideItemLayout'] =
  (layout) => {
    layout.size = ROW_CHAPTER_HEIGHT + DIVIDER_DEPTH;
  };

export const renderItem: ListRenderItem<LocalChapterSchema> = (info) => {
  const { item } = info;
  const extra = info.extraData as {
    manga: IMangaSchema | undefined;
    data: Record<string, ChapterSchema | undefined>;
  };
  return (
    <RowChapter
      mangaKey={extra.manga?._id}
      dateRead={extra.data[item._id]?.dateRead}
      name={item.name}
      indexPage={extra.data[item._id]?.indexPage}
      numberOfPages={extra.data[item._id]?.numberOfPages}
      date={item.date}
      chapterKey={item._id}
      isReading={extra.manga?.currentlyReadingChapter?._id === item._id}
    />
  );
};
