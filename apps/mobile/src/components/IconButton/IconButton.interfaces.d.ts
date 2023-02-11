import { ButtonProps } from '@components/Button/Button.interfaces';
import { IconProps } from '@components/Icon/Icon.interfaces';

import React from 'react';

export interface IconButtonProps
  extends Omit<ButtonProps, 'label' | 'variant' | 'color'>,
    Pick<IconProps, 'color'> {
  compact?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ReactElement<any>;
  animated?: boolean;
}
