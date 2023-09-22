import useBreakpoint from '@app/hooks/useBreakpoint';
import { Manga } from '@mangayomu/mangascraper';
import FlatList, { FlatListProps } from 'flatlist-react';
import Book from './Book';
import React from 'react';
import Button from '@app/components/Button';
import ReactDOM from 'react-dom';
import { MdArrowUpward } from 'react-icons/md';
import { animated, useSpring } from '@react-spring/web';

type SelectivePartial<T, TProperties extends keyof T> = {
  [K in keyof T as K extends TProperties ? K : never]?: T[K];
} & {
  [K in keyof T as K extends TProperties ? never : K]: T[K];
};

type BookListProps = SelectivePartial<FlatListProps<Manga>, 'renderItem'>;

function defaultRenderItem(item: Manga) {
  return (
    <div key={item.link} className="flex-grow flex items-center justify-center">
      <div className="flex-shrink flex items-center justify-center">
        <Book key={item.link} manga={item} />
      </div>
    </div>
  );
}

export default function BookList(props: BookListProps) {
  const {
    searchBy = 'title',
    renderOnScroll = true,
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
        scrollToTop
        renderOnScroll={renderOnScroll}
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
      {listArr.map((x, i) => (
        <Book key={x.link + i} manga={x} />
      ))}
    </div>
  );
}
