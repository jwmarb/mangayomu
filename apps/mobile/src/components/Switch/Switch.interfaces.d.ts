import { ButtonColors } from '@mangayomu/theme';

export interface SwitchProps {
  enabled?: boolean;
  onChange?: (newVal: boolean) => void;
  color?: ButtonColors;
}
