import React from 'react';

export interface SortTypeItemProps {
  selected: boolean;
  sortBy: string;
  reverse: boolean;
  setReverse: React.Dispatch<React.SetStateAction<boolean>>;
  setSort: React.Dispatch<React.SetStateAction<string>>;
}
