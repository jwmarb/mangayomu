import { MangaSchema } from '@database/schemas/Manga';
import useUnfinishedMangas from '@hooks/useUnfinishedMangas';
import UnfinishedMangaItem from '@screens/UnfinishedMangaList/components/UnfinishedMangaItem';
import { FlashListProps, ListRenderItem } from '@shopify/flash-list';
import { MANGA_LIST_ITEM_HEIGHT } from '@theme/constants';

export const renderItem: ListRenderItem<MangaSchema> = (info) => {
  const { item } = info;
  return <UnfinishedMangaItem manga={item} />;
};

export const keyExtractor = (item: MangaSchema) => item.link;

export const overrideItemLayout: FlashListProps<MangaSchema>['overrideItemLayout'] =
  (layout) => {
    layout.size = MANGA_LIST_ITEM_HEIGHT;
  };
