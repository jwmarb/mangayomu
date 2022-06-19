import React from 'react';
import { View } from 'react-native';
import { BadgeContainer } from './Badge.base';
import { BadgeProps } from './Badge.interfaces';

const Badge: React.FC<BadgeProps> = (props) => {
  const { children, color = 'secondary' } = props;

  return (
    <View>
      <BadgeContainer color={color} />
      {children}
    </View>
  );
};

export default Badge;
