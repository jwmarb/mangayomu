import SortTypeItem from '@components/SortTypeItem';
import List from '@components/List';
import React from 'react';

export default function useSort<Comparators>(comparators: Comparators) {
  const [sort, setSort] = React.useState<string>('Alphabetical');
  const [reverse, setReverse] = React.useState<boolean>(false);
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
            setSort={setSort}
          />
        ))}
      </List>
    ),
    sort,
    setSort,
    reverse,
    setReverse,
  };
}
