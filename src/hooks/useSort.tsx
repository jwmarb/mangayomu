import React from 'react';

const SortContextProvider = React.createContext<{
  setSort: React.Dispatch<React.SetStateAction<string>>;
  setReverse: React.Dispatch<React.SetStateAction<boolean>>;
  reverse: boolean;
}>({} as any);

export const useSortContext = () => React.useContext(SortContextProvider);

export default function useSort() {
  const [sort, setSort] = React.useState<string>('Alphabetical');
  const [reverse, setReverse] = React.useState<boolean>(false);

  return {
    SortProvider: React.useCallback<React.FC>(
      ({ children }) => (
        <SortContextProvider.Provider value={{ setSort, setReverse, reverse }}>{children}</SortContextProvider.Provider>
      ),
      [setSort, setReverse, reverse]
    ),
    sort,
    setSort,
    reverse,
    setReverse,
  };
}
