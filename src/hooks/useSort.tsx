import SortTypeItem from '@components/SortTypeItem';
import List from '@components/List';
import React from 'react';

export default function useSort<Comparators>(c: (isReversed: boolean) => Comparators, initialSort?: keyof Comparators) {
  const [sort, setSort] = React.useState<keyof typeof comparators>(initialSort ?? ('Alphabetical' as any));
  const [reverse, setReverse] = React.useState<boolean>(false);
  const comparators = c(reverse);
  const [visible, setVisible] = React.useState<boolean>(false);

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
    selectedSortOption: comparators[sort as keyof typeof comparators],
    sort,
    setSort,
    reverse,
    setReverse,
  };
}
