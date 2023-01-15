import React from 'react';

export interface FilterModalProps {
  onClose: () => void;
  expand: boolean;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
  tabIndex: number;
  sortOptions: JSX.Element;
}
