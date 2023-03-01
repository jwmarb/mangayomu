import Box from '@components/Box';
import { Stack } from '@components/Stack';
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
    icon,
    ...rest
  } = props;

  function handleOnPress() {
    onPress();
    if (optionKey != null) onSelect(optionKey);
  }
  return (
    <MenuOption onSelect={handleOnPress}>
      <Stack
        flex-direction="row"
        py={moderateScale(8)}
        px={moderateScale(16)}
        align-items="center"
        space="s"
      >
        {icon && React.cloneElement(icon, rest)}
        <Text {...rest} variant="button" bold>
          {children}
        </Text>
      </Stack>
    </MenuOption>
  );
};

export default MenuItem;
