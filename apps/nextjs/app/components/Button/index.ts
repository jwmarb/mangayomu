import Button from './Button';
export default Button;
import { OverrideClassName } from '@app/hooks/useClassName';
import type { ButtonColor, ButtonVariant } from '@app/theme';
import React from 'react';
import type { AriaButtonProps } from 'react-aria';

export interface ButtonProps
  extends AriaProps<
      HTMLButtonElement,
      Omit<AriaButtonProps<'button'>, 'isDisabled'>
    >,
    OverrideClassName {
  variant?: ButtonVariant;
  color?: ButtonColor;
  icon?: React.ReactNode;
  iconPlacement?: 'left' | 'right';
  disabled?: boolean;
}
