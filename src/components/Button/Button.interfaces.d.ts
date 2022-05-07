import { ButtonColors } from '@theme/Color/Color.interfaces';
import { ButtonProps as RNButtonProps } from 'react-native';
import { ButtonBaseProps } from '@components/Button/ButtonBase/ButtonBase.interfaces';
import React from 'react';
import Icon from '@components/Icon';

export type ButtonVariants = 'contained' | 'outline' | 'text';

export interface ButtonProps extends Omit<RNButtonProps, 'onPress'> {
  onPress?: () => void;
  color?: ButtonColors;
  variant?: ButtonVariants;
  expand?: boolean | number | string;
  icon?: React.ReactElement<React.ComponentProps<typeof Icon>> | false;
  iconPlacement?: 'left' | 'right';
}

export type ButtonTextProps = Omit<Required<ButtonBaseProps>, 'onPress' | 'opacity'>;
