import Box from '@components/Box';
import Text from '@components/Text';
import React from 'react';
import { MenuOption } from 'react-native-popup-menu';
import { moderateScale } from 'react-native-size-matters';
import { MenuItemProps } from './MenuItem.interfaces';

const MenuItem: React.FC<MenuItemProps> = (props) => {
  const {
    children,
    onPress = () => void 0,
    optionKey,
    onSelect = () => void 0,
    ...rest
  } = props;

  function handleOnPress() {
    onPress();
    if (optionKey != null) onSelect(optionKey);
  }
  return (
    <MenuOption onSelect={handleOnPress}>
      <Box py={moderateScale(8)} px={moderateScale(16)}>
        <Text {...rest} variant="button" bold>
          {children}
        </Text>
      </Box>
    </MenuOption>
  );
};

export default MenuItem;
