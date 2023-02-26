import { SortFilter } from '@mangayomu/schema-creator';
import React from 'react';

export interface SortProps
  extends Omit<SortFilter<string>, 'type' | 'default'> {
  onChange?: (key: string, selected: string) => void;
  onToggleReverse?: (key: string) => void;
  selected: string;
  reversed: boolean;
  name: string;
}
