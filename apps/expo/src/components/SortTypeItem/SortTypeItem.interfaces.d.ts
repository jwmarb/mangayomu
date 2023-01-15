import React from 'react';

export interface SortTypeItemProps {
  selected: boolean;
  sortBy: string;
  setSort: (sort: string) => void;
  setReverse: (reverse: (prev: boolean) => boolean) => void;
  reverse: boolean;
}
