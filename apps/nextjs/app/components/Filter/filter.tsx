import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FilterSelectedContext = React.createContext<any | null>(null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FilterOnChangeContext = React.createContext<
  ((val: any, reversed: boolean) => void) | ((val: any) => void) | null
>(null);
export const FilterReversedContext = React.createContext<boolean | null>(null);

export const useFilterSelectedContext = () => {
  const ctx = React.useContext(FilterSelectedContext);
  if (ctx == null)
    throw new Error(
      'Tried consuming FilterContext when component is not a child of it',
    );
  return ctx;
};
export const useFilterReversedContext = () => {
  const ctx = React.useContext(FilterReversedContext);
  if (ctx == null)
    throw new Error(
      'Tried consuming FilterContext when component is not a child of it',
    );
  return ctx;
};

export const useFilterOnChangeContext = () => {
  const ctx = React.useContext(FilterOnChangeContext);
  if (ctx == null)
    throw new Error(
      'Tried consuming FilterContext when component is not a child of it',
    );
  return ctx;
};

type FilterProps<T> =
  | {
      type: 'sort';
      selected: T;
      reversed: boolean;
      onChange: (val: T, reversed: boolean) => void;
    }
  | {
      type: 'select';
      selected: T;
      onChange: (val: T) => void;
    };

export default function Filter<T>(
  props: React.PropsWithChildren<FilterProps<T>>,
) {
  const { selected, children, onChange } = props;
  switch (props.type) {
    case 'sort':
      return (
        <FilterReversedContext.Provider value={props.reversed}>
          <FilterOnChangeContext.Provider value={onChange}>
            <FilterSelectedContext.Provider value={selected}>
              {children}
            </FilterSelectedContext.Provider>
          </FilterOnChangeContext.Provider>
        </FilterReversedContext.Provider>
      );
    default:
      return (
        <FilterOnChangeContext.Provider value={onChange}>
          <FilterSelectedContext.Provider value={selected}>
            {children}
          </FilterSelectedContext.Provider>
        </FilterOnChangeContext.Provider>
      );
  }
}
