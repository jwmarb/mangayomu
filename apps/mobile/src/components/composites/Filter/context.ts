import React from 'react';
import type { OptionChangeCallback } from '@/components/composites/Filter';

export const SortOptionContext = React.createContext<
  OptionChangeCallback | undefined
>(undefined);

export const SelectOptionContext = React.createContext<
  OptionChangeCallback | undefined
>(undefined);

export const InclusiveExclusiveOptionContext = React.createContext<
  OptionChangeCallback | undefined
>(undefined);

export function useSortOption() {
  return React.useContext(SortOptionContext);
}

export function useSelectOption() {
  return React.useContext(SelectOptionContext);
}

export function useInclusiveExclusiveOption() {
  return React.useContext(InclusiveExclusiveOptionContext);
}
