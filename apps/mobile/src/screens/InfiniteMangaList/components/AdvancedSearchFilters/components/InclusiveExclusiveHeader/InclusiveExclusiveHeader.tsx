import React from 'react';
import { InclusiveExclusiveHeaderProps } from './InclusiveExclusiveHeader.interfaces';
import SectionHeader from '@screens/Library/components/LibraryFilterMenu/Tabs/Filter/components/SectionHeader/SectionHeader';
import { useAdvancedSearchFilters } from '@screens/InfiniteMangaList/components/AdvancedSearchFilters/AdvancedSearchFilters.context';

const InclusiveExclusiveHeader: React.FC<InclusiveExclusiveHeaderProps> = (
  props,
) => {
  const { toggle } = useAdvancedSearchFilters();
  return (
    <SectionHeader
      toggle={toggle}
      title={props.title}
      expanded={props.expanded}
    />
  );
};

export default React.memo(InclusiveExclusiveHeader);
