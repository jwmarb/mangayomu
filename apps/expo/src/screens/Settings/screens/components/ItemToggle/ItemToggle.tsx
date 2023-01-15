import { ListItem, Switch } from '@components/core';
import React from 'react';
import { ItemToggleProps } from './ItemToggle.interfaces';

const ItemToggle: React.FC<ItemToggleProps> = (props) => {
  const { onChange, title, enabled, subtitle, paper } = props;
  return (
    <ListItem
      title={title}
      onPress={onChange}
      adornment={<Switch enabled={enabled} onChange={onChange} />}
      adornmentPlacement='right'
      subtitle={subtitle}
      paper={paper}
    />
  );
};

export default React.memo(ItemToggle);
