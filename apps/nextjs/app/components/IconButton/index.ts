import IconButton from './IconButton';
export default IconButton;
import type { ButtonColor, TextColor } from '@app/theme';
import type { OverrideClassName } from '@app/hooks/useClassName';
import type { AriaButtonProps } from 'react-aria';
export interface IconButtonProps
  extends AriaProps<HTMLButtonElement, AriaButtonProps>,
    OverrideClassName {
  color?: ButtonColor | TextColor;
  icon: React.ReactElement;
  size?: 'small' | 'medium';
}
