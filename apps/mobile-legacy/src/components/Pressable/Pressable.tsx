import { useTheme } from '@emotion/react';
import { ButtonColors } from '@mangayomu/theme';
import React from 'react';
import {
  PressableAndroidRippleConfig,
  Pressable as NativePressable,
} from 'react-native';
import type { PressableProps } from './index';

/**
 * MangaYomu theme-wrapped `Pressable` from React Native
 * @component
 */
function Pressable(
  props: PressableProps,
  ref: React.ForwardedRef<React.ElementRef<typeof NativePressable>>,
) {
  const {
    ripple = true,
    borderless = false,
    foreground = false,
    rippleRadius,
  } = props;
  const theme = useTheme();
  const android_ripple: PressableAndroidRippleConfig | null = ripple
    ? {
        color: props.color
          ? props.color in theme.palette
            ? theme.palette[props.color as ButtonColors].ripple
            : props.color
          : theme.palette.action.ripple,
        borderless,
        foreground,
        radius: rippleRadius,
      }
    : null;
  return (
    <NativePressable {...props} ref={ref} android_ripple={android_ripple} />
  );
}

export default React.forwardRef(Pressable);
