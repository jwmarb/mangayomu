import Animated from 'react-native-reanimated';
import Pressable from './Pressable';
import type { PressableProps as NativePressableProps } from 'react-native';
import { ButtonColors } from '@mangayomu/theme';
export default Pressable;
export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export interface PressableProps extends NativePressableProps {
  // eslint-disable-next-line @typescript-eslint/ban-types
  color?: ButtonColors | (string & {});
  ripple?: boolean;
  borderless?: boolean;
  foreground?: boolean;
  rippleRadius?: number | null;
}
