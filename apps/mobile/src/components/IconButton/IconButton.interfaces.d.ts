import { ButtonProps } from '@components/Button/Button.interfaces';
import { IconProps } from '@components/Icon/Icon.interfaces';

import React from 'react';

export interface IconButtonProps
  extends Omit<ButtonProps, 'label' | 'variant' | 'color'>,
    Pick<IconProps, 'name' | 'color'> {
  compact?: boolean;
}
