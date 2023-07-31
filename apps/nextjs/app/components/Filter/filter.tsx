import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FilterSelectedContext = React.createContext<any | null>(null);
export const FilterUniqContext = React.createContext<Set<any> | null>(null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FilterOnChangeContext = React.createContext<
  ((val: any, reversed: boolean) => void) | ((val: any) => void) | null
>(null);
export const FilterReversedContext = React.createContext<boolean | null>(null);
export const FilterMappedContext = React.createContext<
  ((val: any) => any) | undefined | null
>(null);

export const useFilterSelectedContext = () => {
  const ctx = React.useContext(FilterSelectedContext);
  if (ctx == null)
    throw new Error(
      'Tried consuming FilterContext when component is not a child of it',
    );
  return ctx;
};
export const useFilterUniqContext = () => {
  const ctx = React.useContext(FilterUniqContext);
  if (ctx == null)
    throw new Error(
      'Tried consuming FilterContext when component is not a child of it',
    );
  return ctx;
};
export const useFilterMappedContext = () => {
  const ctx = React.useContext(FilterMappedContext);
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

type FilterCheckbox<T> = {
  type: 'checkbox';
  selected: T[];
  onChange: (val: T[]) => void;
  mapped?: (val: T) => any;
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
    }
  | FilterCheckbox<T>;

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
    case 'checkbox':
      return <CheckboxFilter {...props} />;
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

function CheckboxFilter<T>(props: FilterCheckbox<T> & React.PropsWithChildren) {
  const { onChange, selected, children, mapped } = props;
  const [uniq, setUniq] = React.useState<Set<T>>(new Set());
  React.useEffect(() => {
    setUniq(mapped ? new Set(selected.map(mapped)) : new Set(selected));
  }, [selected, mapped]);
  return (
    <FilterUniqContext.Provider value={uniq}>
      <FilterMappedContext.Provider value={mapped}>
        <FilterOnChangeContext.Provider value={onChange}>
          <FilterSelectedContext.Provider value={selected}>
            {children}
          </FilterSelectedContext.Provider>
        </FilterOnChangeContext.Provider>
      </FilterMappedContext.Provider>
    </FilterUniqContext.Provider>
  );
}
