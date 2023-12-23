import { KEYS_OF_SORT_CHAPTERS_BY, useManga } from '@database/schemas/Manga';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { SortProps } from './Sort.interfaces';
import React from 'react';
import { ListRenderItem } from 'react-native';
import SortItem from '@components/Filters/SortItem';
import { SortChaptersBy } from '@mangayomu/schemas';
import { useLocalRealm } from '@database/main';
import { LocalMangaSchema } from '@database/schemas/LocalManga';

const Sort: React.FC<SortProps> = (props) => {
  const localRealm = useLocalRealm();

  const onChange = React.useCallback((t: SortChaptersBy) => {
    const c = localRealm.objectForPrimaryKey(LocalMangaSchema, props.mangaLink);
    if (c != null)
      localRealm.write(() => {
        c.sortChaptersBy = t;
      });
  }, []);
  const onToggleReverse = React.useCallback(() => {
    const c = localRealm.objectForPrimaryKey(LocalMangaSchema, props.mangaLink);
    if (c != null)
      localRealm.write(() => {
        c.reversedSort = !c.reversedSort;
      });
  }, []);
  const renderItem = React.useCallback<ListRenderItem<SortChaptersBy>>(
    ({ item }) => (
      <SortItem
        isSelected={props.sortMethod === item}
        reversed={props.reversed}
        title={item}
        onChange={onChange}
        onToggleReverse={onToggleReverse}
      />
    ),
    [props.sortMethod, props.reversed],
  );
  return (
    <BottomSheetFlatList
      data={KEYS_OF_SORT_CHAPTERS_BY}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
};

const keyExtractor = (i: string) => i;

export default Sort;
