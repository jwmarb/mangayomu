import { MutableInclusiveExclusiveFilter } from '@utils/MangaFilters/schema';
import React from 'react';

export interface InclusiveExclusiveItemProps {
  item: string;
  state: 'include' | 'exclude' | 'none';
  stateChanger: React.Dispatch<React.SetStateAction<MutableInclusiveExclusiveFilter<string>>>;
}
