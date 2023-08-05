import { MangaSchema } from '@database/schemas/Manga';
import { ListRenderItem } from '@shopify/flash-list';
import UnfinishedManga from './components/UnfinishedManga';
import { UNFINISHED_MANGA_WIDTH } from '@theme/constants';
import Box from '@components/Box';
import { ChapterSchema } from '@database/schemas/Chapter';
import { LocalChapterSchema } from '@database/schemas/LocalChapter';

export const renderItem: ListRenderItem<MangaSchema> = (info) => {
  const { item } = info;

  return <UnfinishedManga manga={item} />;
};

export const ItemSeparatorComponent = () => <Box mx="s" />;

export const keyExtractor = (item: MangaSchema) => item._id.toHexString();

export const overrideItemLayout: (
  layout: {
    span?: number | undefined;
    size?: number | undefined;
  },
  item: MangaSchema & Realm.Object<unknown, never>,
  index: number,
  maxColumns: number,
  extraData?: any,
) => void = (layout) => {
  layout.size = UNFINISHED_MANGA_WIDTH;
};
