import {
  KEYS_OF_SORT_CHAPTERS_BY,
  SortChaptersMethod,
  SORT_CHAPTERS_BY,
  useManga,
} from '@database/schemas/Manga';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { SortProps } from './Sort.interfaces';
import React from 'react';
import { ListRenderItem } from 'react-native';
import Text from '@components/Text';
import SortItem from '@screens/Welcome/components/MainSourceSelector/components/Header/Tabs/Sort/Sort.item';
import { inPlaceSort } from 'fast-sort';

const Sort: React.FC<SortProps> = (props) => {
  const { update } = useManga(props.mangaLink);

  const onChange = React.useCallback(
    (t: SortChaptersMethod) => {
      update((obj, getChapter) => {
        const p = (a: string) => {
          const parsedA = getChapter(a);
          if (parsedA == null)
            throw Error(`${a} does not exist in Chapters collection`);
          return SORT_CHAPTERS_BY[t](parsedA);
        };
        obj.sortChaptersBy = t;
        obj.chapters = inPlaceSort([...obj.chapters]).by([
          obj.reversedSort ? { desc: p } : { asc: p },
        ]);
      });
    },
    [update],
  );
  const onToggleReverse = React.useCallback(() => {
    update((obj, getChapter) => {
      const p = (a: string) => {
        const parsedA = getChapter(a);
        if (parsedA == null)
          throw Error(`${a} does not exist in Chapters collection`);
        return SORT_CHAPTERS_BY[obj.sortChaptersBy](parsedA);
      };
      obj.reversedSort = !obj.reversedSort;
      obj.chapters = inPlaceSort([...obj.chapters]).by([
        obj.reversedSort ? { desc: p } : { asc: p },
      ]);
    });
  }, [update]);
  const renderItem = React.useCallback<ListRenderItem<SortChaptersMethod>>(
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
