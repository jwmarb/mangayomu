import useBreakpoint from '@app/hooks/useBreakpoint';
import { Manga } from '@mangayomu/mangascraper';
import FlatList, { FlatListProps } from 'flatlist-react';
import Book from './Book';
import React from 'react';

type SelectivePartial<T, TProperties extends keyof T> = {
  [K in keyof T as K extends TProperties ? K : never]?: T[K];
} & {
  [K in keyof T as K extends TProperties ? never : K]: T[K];
};

type BookListProps = SelectivePartial<FlatListProps<Manga>, 'renderItem'>;

function defaultRenderItem(item: Manga) {
  return (
    <div className="flex-shrink items-center justify-center">
      <Book key={item.link} manga={item} />
    </div>
  );
}

export default function BookList(props: BookListProps) {
  const {
    searchBy = 'title',
    searchCaseInsensitive = true,
    displayGrid = true,
    minColumnWidth: _,
    searchableMinCharactersCount = 1,
    gridGap = '0rem',
    renderItem = defaultRenderItem,
    list,
    ...rest
  } = props;
  const isBreakpoint = useBreakpoint();
  const minColumnWidth = React.useMemo(() => {
    if (isBreakpoint('md')) return '8.5rem';
    else if (isBreakpoint('sm')) return '7.5rem';
    return '7rem';
  }, [isBreakpoint]);

  const listArr = React.useMemo(() => {
    if (Array.isArray(list)) return list;
    if (list instanceof Map || list instanceof Set)
      return Array.from(list.values());
    return Object.values(list);
  }, [list]);

  if (listArr.length > 36)
    return (
      <FlatList
        renderItem={renderItem}
        minColumnWidth={minColumnWidth}
        displayGrid={displayGrid}
        searchCaseInsensitive={searchCaseInsensitive}
        searchBy={searchBy}
        searchableMinCharactersCount={searchableMinCharactersCount}
        gridGap={gridGap}
        list={list}
        {...rest}
      />
    );

  return (
    <div className="flex justify-center flex-shrink flex-row flex-wrap">
      {listArr.map((x) => (
        <Book key={x.link} manga={x} />
      ))}
    </div>
  );
}
