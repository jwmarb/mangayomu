import type { ButtonColor } from '@app/theme';
import type { OverrideClassName } from '@app/hooks/useClassName';
import type { AriaButtonProps } from 'react-aria';
export interface IconButtonProps
  extends AriaButtonProps,
    React.HTMLProps<HTMLButtonElement>,
    OverrideClassName {
  color?: ButtonColor;
  icon: React.ReactElement;
}
