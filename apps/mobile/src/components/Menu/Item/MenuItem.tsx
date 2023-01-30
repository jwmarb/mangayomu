import Box from '@components/Box';
import Text from '@components/Text';
import React from 'react';
import { MenuOption } from 'react-native-popup-menu';
import { moderateScale } from 'react-native-size-matters';
import { MenuItemProps } from './MenuItem.interfaces';

const MenuItem: React.FC<MenuItemProps> = (props) => {
  const { children, onPress = () => void 0 } = props;

  return (
    <MenuOption onSelect={onPress}>
      <Box py={moderateScale(12)} px={moderateScale(16)}>
        <Text variant="button" bold>
          {children}
        </Text>
      </Box>
    </MenuOption>
  );
};

export default MenuItem;
