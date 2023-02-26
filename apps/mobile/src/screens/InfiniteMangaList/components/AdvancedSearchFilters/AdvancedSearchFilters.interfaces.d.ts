import { AbstractFilters } from '@mangayomu/schema-creator';
import { StatefulFilter } from '@screens/InfiniteMangaList/InfiniteMangaList';
import React from 'react';

export interface AdvancedSearchFiltersProps extends React.PropsWithChildren {
  keys: string[];
  dummyStates: Record<string, AbstractFilters>;
  states: Record<string, StatefulFilter>;
  onChangeOption: (key: string, val: string) => void;
  onChangeSort: (key: string, val: string) => void;
  onToggleReverseSort: (key: string) => void;
  onToggleInclusiveExclusive: (key: string, value: string) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  accordionKeys: string[];
}
