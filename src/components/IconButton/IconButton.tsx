import ButtonBase from '@components/Button/ButtonBase';
import Flex from '@components/Flex';
import React from 'react';
import { View } from 'react-native';
import { IconButtonBaseContainer } from './IconButton.base';
import { IconButtonProps } from './IconButton.interfaces';

const IconButton: React.FC<IconButtonProps> = (props) => {
  const { onPress = () => void 0, color, disabled = false, icon } = props;
  return (
    <ButtonBase onPress={onPress} round color={color} disabled={disabled}>
      <IconButtonBaseContainer>{React.cloneElement(icon, { size: 'small', color })}</IconButtonBaseContainer>
    </ButtonBase>
  );
};

export default IconButton;
