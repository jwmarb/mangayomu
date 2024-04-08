import React from 'react';
import { OptionChangeCallback } from '@/components/composites/Filter';
import {
  SelectOptionContext,
  SortOptionContext,
  InclusiveExclusiveOptionContext,
} from '@/components/composites/Filter/context';
import Sort from '@/components/composites/Filter/components/Sort';

export type FilterProps = {
  onOption?: OptionChangeCallback;
};

function Filter(props: React.PropsWithChildren<FilterProps>) {
  const { children, onOption } = props;
  return (
    <SelectOptionContext.Provider value={onOption}>
      <SortOptionContext.Provider value={onOption}>
        <InclusiveExclusiveOptionContext.Provider value={onOption}>
          {children}
        </InclusiveExclusiveOptionContext.Provider>
      </SortOptionContext.Provider>
    </SelectOptionContext.Provider>
  );
}

Filter.Sort = Sort;

export default Filter;
