import React from 'react';

export interface FilterModalProps {
  onClose: () => void;
  expand: boolean;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
  tabIndex: number;
  sortTypes: string[];
  sort: string;
  reverse: boolean;
  setReverse: React.Dispatch<React.SetStateAction<boolean>>;
  setSort: React.Dispatch<React.SetStateAction<string>>;
}
