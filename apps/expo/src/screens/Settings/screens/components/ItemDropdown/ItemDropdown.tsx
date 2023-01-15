import { ListItem, Typography } from '@components/core';
import React from 'react';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { useTheme } from 'styled-components/native';
import { ItemDropdownMenu, ItemDropdownProps } from './ItemDropdown.interfaces';

const ItemDropdown: React.FC<ItemDropdownProps> = (props) => {
  const { title, subtitle, items, icon, paper = false } = props;
  const ref = React.useRef<Menu>(null);
  function handleOnPress() {
    ref.current?.open();
  }
  const theme = useTheme();
  return (
    <Menu ref={ref}>
      <MenuTrigger>
        <ListItem
          title={title}
          subtitle={subtitle}
          adornment={icon}
          adornmentPlacement='left'
          paper={paper}
          onPress={handleOnPress}
        />
      </MenuTrigger>
      <MenuOptions customStyles={theme.menuOptionsStyle}>
        {items.map((x) => (
          <MemoizedMenuOption key={x.text} {...x} />
        ))}
      </MenuOptions>
    </Menu>
  );
};

const MemoizedMenuOption: React.FC<ItemDropdownMenu> = React.memo((x) => (
  <MenuOption onSelect={x.onPress}>
    <Typography fontFamily={x.fontFamily} color={x.isSelected ? 'primary' : 'textPrimary'}>
      {x.text}
    </Typography>
  </MenuOption>
));

export default React.memo(ItemDropdown);
