import { StyleProp, View, ViewStyle } from 'react-native';
import React from 'react';
import { iconButton } from '@/components/primitives/IconButton/styles';
import { ButtonProps } from '@/components/primitives/Button/Button';
import Pressable from '@/components/primitives/Pressable';
import Icon, { IconProps } from '@/components/primitives/Icon';
import { createThemedProps } from '@/utils/theme';
import {
  ICON_BUTTON_COLORS,
  IconButtonColors,
} from '@/components/primitives/types';
import useThemedProps from '@/hooks/useThemedProps';
import useContrast from '@/hooks/useContrast';

export type IconButtonProps = Omit<ButtonProps, 'title' | 'color' | 'style'> & {
  icon: React.ReactElement<IconProps, typeof Icon>;
  size?: 'small' | 'medium';
  color?: IconButtonColors;
  style?: StyleProp<ViewStyle>;
};

const clonedIconProps = (color: IconButtonColors) => ({
  style: { textAlign: 'center' as const },
  color: color === 'default' ? undefined : color,
});

const composedClonedIconProps = ICON_BUTTON_COLORS.reduce((prev, curr) => {
  prev[curr] = clonedIconProps(curr);
  return prev;
}, {} as Record<IconButtonColors, Partial<IconProps>>);
const pressableProps = (color: IconButtonColors) =>
  createThemedProps((theme) => ({
    android_ripple: {
      borderless: true,
      color: color === 'default' ? undefined : theme.palette[color].ripple,
    },
  }));
const composedPressableProps = ICON_BUTTON_COLORS.reduce((prev, curr) => {
  prev[curr] = pressableProps(curr);
  return prev;
}, {} as Record<IconButtonColors, ReturnType<typeof pressableProps>>);

export default function IconButton(props: IconButtonProps) {
  const {
    icon,
    contrast: contrastProp,
    color = 'default',
    style: styleProp,
    size = 'medium',
    ...rest
  } = props;
  const contrast = useContrast(contrastProp);
  const { android_ripple } = useThemedProps(
    composedPressableProps[color],
    contrast,
  );
  const style = [
    size === 'medium' ? iconButton.container : iconButton.containerSmall,
    styleProp,
  ];

  const iconProps = {
    ...icon.props,
    ...composedClonedIconProps[color],
    style: [icon.props.style, composedClonedIconProps[color].style],
  };
  return (
    <View style={style}>
      <Pressable
        style={iconButton.pressable}
        android_ripple={android_ripple}
        {...rest}
      >
        {React.cloneElement(icon, iconProps)}
      </Pressable>
    </View>
  );
}
