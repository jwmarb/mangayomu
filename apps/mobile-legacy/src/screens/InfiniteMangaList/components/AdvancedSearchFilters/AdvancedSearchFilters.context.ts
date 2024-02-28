import React from 'react';

type AdvancedSearchFiltersContextState = {
  toggle: (key: string) => void;
  onToggleInclusiveExclusive: (key: string, value: string) => void;
};

export const AdvancedSearchFiltersContext = React.createContext<
  AdvancedSearchFiltersContextState | undefined
>(undefined);

export const useAdvancedSearchFilters = () => {
  const ctx = React.useContext(AdvancedSearchFiltersContext);
  if (ctx == null)
    throw Error(
      'Tried accessing AdvancedSearchFiltersContext when component is not a child of it',
    );
  return ctx;
};
