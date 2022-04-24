import React from 'react';

export type SearchProps = {
  onChangeText?: React.Dispatch<React.SetStateAction<string>>;
  onSubmitEditing?: React.Dispatch<React.SetStateAction<string>>;
  showSearchBar: boolean;
  setShowSearchBar: React.Dispatch<React.SetStateAction<boolean>>;
  additionalButtons?: React.ReactElement<any>;
  onExitSearch?: () => void;
  defaultText?: string;
  title: string;
  ref?: any;
};
