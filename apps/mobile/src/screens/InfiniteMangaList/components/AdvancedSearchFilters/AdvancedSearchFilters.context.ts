import React from 'react';

type AdvancedSearchFiltersContextState = {
  toggle: (key: string) => void;
  onToggleInclusiveExclusive: (key: string, value: string) => void;
};

export const AdvancedSearchFiltersContext =
  React.createContext<AdvancedSearchFiltersContextState | null>(null);

export const useAdvancedSearchFilters = <
  T extends Partial<AdvancedSearchFiltersContextState>,
>(
  props?: T,
) => {
  const ctx = React.useContext(AdvancedSearchFiltersContext);
  if (ctx == null) return props as T;
  return ctx;
};
