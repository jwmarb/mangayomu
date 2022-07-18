import Icon from '@components/Icon';
import React from 'react';

export interface MenuOptionProps {
  icon?: React.ReactElement<React.ComponentProps<typeof Icon>>;
  text: string;
  onPress?: () => void;
}
