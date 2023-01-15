import { ButtonProps } from '@components/Button/Button.interfaces';
import { Icon } from '@components/core';
import React from 'react';

export interface IconButtonProps extends Omit<ButtonProps, 'expand' | 'title'> {
  icon: React.ReactElement<React.ComponentProps<typeof Icon>>;
}
