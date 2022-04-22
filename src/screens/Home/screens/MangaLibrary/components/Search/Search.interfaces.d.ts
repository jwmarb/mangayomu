import React from 'react';

export interface SearchProps {
  showSearch: boolean;
  onToggleSearch: () => void;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  onExpand: () => void;
  ref?: any;
}
