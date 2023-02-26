import Accordion from '@components/Accordion';
import SortItem from '@components/Filters/SortItem';
import React from 'react';
import { SortProps } from './Sort.interfaces';

const Sort: React.FC<SortProps> = (props) => {
  const {
    onChange = () => void 0,
    onToggleReverse = () => void 0,
    options,
    reversed,
    selected,
    name,
  } = props;
  const handleOnToggleReverse = React.useCallback(() => {
    onToggleReverse(name);
  }, [name, onToggleReverse]);
  const handleOnChange = React.useCallback(
    (i: string) => {
      onChange(name, i);
    },
    [name, onChange],
  );
  return (
    <Accordion title={name} containerProps={{ mx: 'm' }}>
      {options.map((x, i) => (
        <SortItem
          key={i}
          title={x}
          reversed={reversed}
          isSelected={selected === x}
          onToggleReverse={handleOnToggleReverse}
          onChange={handleOnChange}
        />
      ))}
    </Accordion>
  );
};

export default React.memo(Sort);
