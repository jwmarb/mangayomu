import FilterItem from '@components/Filters/FilterItem';
import React from 'react';
import { InclusiveExclusiveProps } from './InclusiveExclusive.interfaces';
import { useAdvancedSearchFilters } from '@screens/InfiniteMangaList/components/AdvancedSearchFilters/AdvancedSearchFilters.context';

const InclusiveExclusive: React.FC<InclusiveExclusiveProps> = (props) => {
  const { state, itemKey, title, fieldKey } = props;
  const { onToggleInclusiveExclusive } = useAdvancedSearchFilters();
  const handleOnToggle = React.useCallback(
    (itemKey: string) => {
      onToggleInclusiveExclusive &&
        onToggleInclusiveExclusive(fieldKey, itemKey);
    },
    [onToggleInclusiveExclusive, fieldKey, itemKey],
  );
  return (
    <FilterItem
      state={state}
      title={title}
      itemKey={itemKey}
      onToggle={handleOnToggle}
    />
  );
};

export default React.memo(InclusiveExclusive);
