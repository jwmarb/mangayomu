import { InclusiveExclusiveFilter } from '@mangayomu/schema-creator';
import { FilterState } from '@redux/slices/mainSourceSelector';
import React from 'react';

export interface InclusiveExclusiveProps {
  onToggleInclusiveExclusive?: (key: string, value: string) => void;
  itemKey: string;
  fieldKey: string;
  title: string;
  state: FilterState;
}
