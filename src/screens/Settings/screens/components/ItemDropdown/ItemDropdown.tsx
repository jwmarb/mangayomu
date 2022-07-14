import { ListItem } from '@components/core';
import React from 'react';
import { ItemDropdownProps } from './ItemDropdown.interfaces';

const ItemDropdown: React.FC<ItemDropdownProps> = (props) => {
  const { title, subtitle, items } = props;
  return <ListItem title={title} subtitle={subtitle} holdItem={items} />;
};

export default React.memo(ItemDropdown);
