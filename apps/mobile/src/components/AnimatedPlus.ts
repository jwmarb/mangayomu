/**
 * Animated components for react-native-reanimated
 */

import _Box from './Box';
import _Stack from './Stack';
import _Text from './Text';
import _Icon from './Icon';
import Animated from 'react-native-reanimated';

export const Box = Animated.createAnimatedComponent(_Box);
export const Stack = Animated.createAnimatedComponent(_Stack);
export const Text = Animated.createAnimatedComponent(_Text);
export const Icon = Animated.createAnimatedComponent(_Icon);
