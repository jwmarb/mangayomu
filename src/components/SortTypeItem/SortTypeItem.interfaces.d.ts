import React from 'react';

export interface SortTypeItemProps {
  selected: boolean;
  sortBy: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;
  setReverse: React.Dispatch<React.SetStateAction<boolean>>;
  reverse: boolean;
}
