import { KEYS_OF_SORT_CHAPTERS_BY, useManga } from '@database/schemas/Manga';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { SortProps } from './Sort.interfaces';
import React from 'react';
import { ListRenderItem } from 'react-native';
import SortItem from '@components/Filters/SortItem';
import { SortChaptersBy } from '@mangayomu/schemas';

const Sort: React.FC<SortProps> = (props) => {
  const { update } = useManga(props.mangaLink);

  const onChange = React.useCallback(
    (t: SortChaptersBy) => {
      update((obj) => {
        obj.sortChaptersBy = t;
      });
    },
    [update],
  );
  const onToggleReverse = React.useCallback(() => {
    update((obj) => {
      obj.reversedSort = !obj.reversedSort;
    });
  }, [update]);
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
