import { MangaSchema } from '@database/schemas/Manga';
import { ListRenderItem } from '@shopify/flash-list';
import UnfinishedManga from './components/UnfinishedManga';
import { UNFINISHED_MANGA_WIDTH } from '@theme/constants';
import Box from '@components/Box';
import { ChapterSchema } from '@database/schemas/Chapter';

export const renderItem: ListRenderItem<
  MangaSchema & Realm.Object<unknown, never>
> = (info) => {
  const { item } = info;
  const extraData = info.extraData as Record<
    string,
    Realm.Results<ChapterSchema & Realm.Object<unknown, never>>
  >;
  return <UnfinishedManga manga={item} chapters={extraData[item._id]} />;
};

export const ItemSeparatorComponent = () => <Box mx="s" />;

export const keyExtractor = (
  item: MangaSchema & Realm.Object<unknown, never>,
) => item._id;

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
