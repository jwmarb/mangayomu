import IconButton from './IconButton';
export default IconButton;
export * from './IconButton.helpers';
import { ButtonProps } from '@components/Button/';
import { IconProps } from '@components/Icon/';

import React from 'react';

export interface IconButtonProps
  extends Omit<ButtonProps, 'label' | 'variant' | 'color'>,
    Pick<IconProps, 'color'> {
  compact?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ReactElement<any>;
  animated?: boolean;
  rippleColor?: string;
}
