import { MangaSchema } from '@database/schemas/Manga';
import { ListRenderItem } from '@shopify/flash-list';
import UnfinishedManga from './components/UnfinishedManga';
import { UNFINISHED_MANGA_HEIGHT } from '@theme/constants';

export const renderItem: ListRenderItem<
  MangaSchema & Realm.Object<unknown, never>
> = ({ item, extraData }) => (
  <UnfinishedManga manga={item} chapters={extraData[item._id]} />
);

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
  layout.size = UNFINISHED_MANGA_HEIGHT;
};
