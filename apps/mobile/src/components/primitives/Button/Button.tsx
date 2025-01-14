import { PressableAndroidRippleConfig, View } from 'react-native';
import type { PressableProps as NativeButtonProps } from 'react-native-gesture-handler';
import React from 'react';
import { styles, variants } from '@/components/primitives/Button/styles';
import {
  BUTTON_COLORS,
  BUTTON_VARIANTS,
  ButtonColors,
  ButtonVariants,
} from '@/components/primitives/types';
import useStyles from '@/hooks/useStyles';
import Pressable from '@/components/primitives/Pressable';
import { createThemedProps } from '@/utils/theme';
import useThemedProps from '@/hooks/useThemedProps';
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import { IconProps } from '@/components/primitives/Icon';

export type ButtonProps = NativeButtonProps & {
  variant?: ButtonVariants;
  color?: ButtonColors;
  contrast?: boolean;
  textAlignment?: 'left' | 'center' | 'right';
  icon?: React.ReactElement<IconProps>;
  iconPlacement?: 'left' | 'right';
  title: string;
};

const themedProps = (color: ButtonColors) =>
  createThemedProps((theme) => ({
    android_ripple: {
      color: theme.palette[color].ripple,
    } as PressableAndroidRippleConfig,
  }));

const composedVariants = BUTTON_COLORS.reduce(
  (prev1, curr1) => {
    prev1[curr1] = (['disabled', 'enabled'] as const).reduce(
      (prev2, curr2) => {
        prev2[curr2] = variants(curr1, curr2);
        return prev2;
      },
      {} as Record<'disabled' | 'enabled', ReturnType<typeof variants>>,
    );
    return prev1;
  },
  {} as Record<
    ButtonColors,
    Record<'disabled' | 'enabled', ReturnType<typeof variants>>
  >,
);

const composedRippleColors = BUTTON_COLORS.reduce(
  (prev, curr) => {
    prev[curr] = themedProps(curr);
    return prev;
  },
  {} as Record<ButtonColors, ReturnType<typeof themedProps>>,
);

const composedStyles = BUTTON_VARIANTS.reduce(
  (prev1, curr1) => {
    prev1[curr1] = BUTTON_COLORS.reduce(
      (prev2, curr2) => {
        prev2[curr2] = styles(curr1, curr2);
        return prev2;
      },
      {} as Record<ButtonColors, ReturnType<typeof styles>>,
    );
    return prev1;
  },
  {} as Record<ButtonVariants, Record<ButtonColors, ReturnType<typeof styles>>>,
);

export default function Button(props: ButtonProps) {
  const {
    variant: variantProp = 'text',
    color = 'primary',
    title,
    contrast: contrastProp,
    textAlignment = 'left',
    disabled,
    iconPlacement = 'left',
    icon,
    ...rest
  } = props;
  const contrast = useContrast(contrastProp);
  const variant = useStyles(
    composedVariants[color][disabled ? 'disabled' : 'enabled'],
    contrast,
  );
  const btnStyles = useStyles(composedStyles[variantProp][color], contrast);
  const { android_ripple } = useThemedProps(
    composedRippleColors[color],
    contrast,
  );
  const style = [variant[variantProp], btnStyles.button];
  const textColor = disabled
    ? 'disabled'
    : variantProp === 'contained'
      ? 'textPrimary'
      : color;

  return (
    <View style={btnStyles.container}>
      <Pressable
        android_ripple={android_ripple}
        style={[btnStyles.pressable, style]}
        disabled={disabled}
        {...rest}
      >
        {iconPlacement === 'left' &&
          icon &&
          React.cloneElement(icon, { color })}
        <Text
          alignment={textAlignment}
          variant="button"
          color={textColor}
          style={btnStyles.text}
        >
          {title}
        </Text>
        {iconPlacement === 'right' &&
          icon &&
          React.cloneElement(icon, { color })}
      </Pressable>
    </View>
  );
}
