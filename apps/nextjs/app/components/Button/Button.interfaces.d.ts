import { OverrideClassName } from '@app/hooks/useClassName';
import type { ButtonColor, ButtonVariant } from '@app/theme';
import React from 'react';
import type { AriaButtonProps } from 'react-aria';

export interface ButtonProps
  extends AriaButtonProps<'button'>,
    React.HTMLProps<HTMLButtonElement>,
    OverrideClassName {
  variant?: ButtonVariant;
  color?: ButtonColor;
}
