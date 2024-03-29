import React from 'react';

export const ITEM_HEIGHT = 42;
export const SORT_ITEM_HEIGHT = 50;

export type InclusiveExclusiveType = 'exclude' | 'include' | 'none';
export type InclusiveExclusiveOperation = {
  title: string;
  type: InclusiveExclusiveType;
  item: string;
};
export type OptionOperation = {
  title: string;
  item: string;
};
export type SortOperation = {
  title: string;
  item: string;
};

export const InclusiveExclusiveDispatcher = React.createContext<
  ((operation: InclusiveExclusiveOperation) => void) | null
>(null);
export const OptionDispatcher = React.createContext<
  ((operation: OptionOperation) => void) | null
>(null);
export const SortDispatcher = React.createContext<
  ((operation: SortOperation) => void) | null
>(null);

export function useInclusiveExclusiveDispatcher() {
  const ctx = React.useContext(InclusiveExclusiveDispatcher);
  if (ctx == null) {
    throw new Error(
      'Invalid hook call when component is not a child of InclusiveExclusiveDispatcher',
    );
  }
  return ctx;
}

export function useOptionDispatcher() {
  const ctx = React.useContext(OptionDispatcher);
  if (ctx == null) {
    throw new Error(
      'Invalid hook call when component is not a child of OptionDispatcher',
    );
  }
  return ctx;
}

export function useSortDispatcher() {
  const ctx = React.useContext(SortDispatcher);
  if (ctx == null) {
    throw new Error(
      'Invalid hook call when component is not a child of SortDispatcher',
    );
  }
  return ctx;
}
