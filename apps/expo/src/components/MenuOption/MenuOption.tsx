import React from 'react';
import { MenuOptionProps } from './MenuOption.interfaces';
import { MenuOption as BaseMenuOption } from 'react-native-popup-menu';
import { Typography } from '@components/Typography';
import Spacer from '@components/Spacer';
import Flex from '@components/Flex';

const MenuOption: React.FC<MenuOptionProps> = (props) => {
  const { text, icon, onPress, color, value, ...rest } = props;
  return (
    <BaseMenuOption onSelect={onPress} value={value ?? text} {...rest}>
      <Flex alignItems='center'>
        {icon && (
          <>
            {React.cloneElement(icon, { size: 'small', color })}
            <Spacer x={3} />
          </>
        )}
        <Typography color={color}>{text}</Typography>
      </Flex>
    </BaseMenuOption>
  );
};

export default React.memo(MenuOption);
