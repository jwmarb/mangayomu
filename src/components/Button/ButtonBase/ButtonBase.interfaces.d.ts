import { ButtonColors } from '@theme/Color/Color.interfaces';
import { ButtonVariants } from '@components/Button/Button.interfaces';

export interface ButtonBaseProps {
  color?: ButtonColors;
  round?: boolean;
  variant?: ButtonVariants;
  disabled?: boolean;
  expand?: boolean;
}
