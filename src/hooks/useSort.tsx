import SortTypeItem from '@components/SortTypeItem';
import List from '@components/List';
import React from 'react';
import { Comparator } from '@utils/Algorithms/Comparator/Comparator.interfaces';
import useMountedEffect from '@hooks/useMountedEffect';

export default function useSort<Comparators>(
  c: (sortCreator: typeof createSort) => Comparators,
  initialSort?: keyof Comparators,
  stateSetter?: (newState: keyof Comparators) => void,
  initialReverse?: boolean,
  reverseSetter?: (newState: boolean) => void
) {
  const [sort, setSort] = React.useState<keyof typeof comparators>(initialSort ?? ('Alphabetical' as any));

  const [reverse, setReverse] = React.useState<boolean>(initialReverse ?? false);
  function createSort<T>(compareFn: Comparator<T>): Comparator<T> {
    return (a: T, b: T) => {
      if (reverse) return -compareFn(a, b);
      return compareFn(a, b);
    };
  }
  const comparators = c(createSort);
  const [visible, setVisible] = React.useState<boolean>(false);
  useMountedEffect(() => {
    if (stateSetter) stateSetter(sort);
    if (reverseSetter) reverseSetter(reverse);
  }, [sort, reverse]);

  return {
    visible,
    handleOnOpenModal: React.useCallback(() => {
      setVisible(true);
    }, [setVisible]),
    handleOnCloseModal: React.useCallback(() => {
      setVisible(false);
    }, [setVisible]),
    sortOptions: (
      <List>
        {(Object.keys(comparators) as unknown as readonly (keyof typeof comparators)[]).map((x, i) => (
          <SortTypeItem
            key={i}
            sortBy={x as any}
            selected={sort === x}
            reverse={reverse}
            setReverse={setReverse}
            setSort={setSort as any}
          />
        ))}
      </List>
    ),
    selectedSortOption: (comparators as any)[sort as keyof typeof comparators] as (a: any, b: any) => number,
    sort,
    setSort,
    reverse,
    setReverse,
  };
}
