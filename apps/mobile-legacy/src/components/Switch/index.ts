import Switch from './Switch';
export default Switch;
import { ButtonColors } from '@mangayomu/theme';

export interface SwitchProps {
  enabled?: boolean;
  onChange?: (newVal: boolean) => void;
  color?: ButtonColors;
}
