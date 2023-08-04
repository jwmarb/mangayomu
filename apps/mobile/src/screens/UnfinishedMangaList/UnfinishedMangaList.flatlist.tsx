import { MangaSchema } from '@database/schemas/Manga';
import useUnfinishedMangas from '@hooks/useUnfinishedMangas';
import UnfinishedMangaItem from '@screens/UnfinishedMangaList/components/UnfinishedMangaItem';
import { FlashListProps, ListRenderItem } from '@shopify/flash-list';
import { MANGA_LIST_ITEM_HEIGHT } from '@theme/constants';

export const renderItem: ListRenderItem<MangaSchema> = (info) => {
  const { item } = info;
  const extraData = info.extraData as ReturnType<typeof useUnfinishedMangas>[1];
  return <UnfinishedMangaItem manga={item} chapters={extraData[item.link]} />;
};

export const keyExtractor = (item: MangaSchema) => item.link;

export const overrideItemLayout: FlashListProps<MangaSchema>['overrideItemLayout'] =
  (layout) => {
    layout.size = MANGA_LIST_ITEM_HEIGHT;
  };
