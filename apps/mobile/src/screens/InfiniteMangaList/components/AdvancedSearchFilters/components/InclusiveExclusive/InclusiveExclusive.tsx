import FilterItem from '@components/Filters/FilterItem';
import React from 'react';
import { InclusiveExclusiveProps } from './InclusiveExclusive.interfaces';

const InclusiveExclusive: React.FC<InclusiveExclusiveProps> = (props) => {
  const {
    onToggleInclusiveExclusive = () => void 0,
    state,
    itemKey,
    title,
    fieldKey,
  } = props;
  const handleOnToggle = React.useCallback(
    (itemKey: string) => {
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
