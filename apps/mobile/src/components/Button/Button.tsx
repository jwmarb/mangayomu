import React from 'react';
import { ButtonProps } from './Button.interfaces';
import { TouchableOpacity, Text } from 'react-native';

const Button: React.FC<ButtonProps> = (props) => {
  const { label } = props;
  return (
    <TouchableOpacity>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
};

export default Button;
