import React from 'react';
import { PressableProps, StyleProp, View, ViewStyle } from 'react-native';
import { styles } from '@/components/primitives/Chip/styles';
import Pressable from '@/components/primitives/Pressable';
import Text, { TextProps } from '@/components/primitives/Text';
import {
  CHIP_COLORS,
  ChipColors,
  ChipVariants,
  TEXT_COLOR_TYPES,
} from '@/components/primitives/types';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { IconProps } from '@/components/primitives/Icon';
import useTheme from '@/hooks/useTheme';
import { createThemedProps } from '@/utils/theme';
import useThemedProps from '@/hooks/useThemedProps';

export type ChipProps = {
  color?: ChipColors;
  contrast?: boolean;
  title: string;
  variant?: ChipVariants;
  icon?: React.ReactElement<IconProps>;
  style?: StyleProp<ViewStyle>;
  textProps?: TextProps;
} & Omit<PressableProps, 'style'>;

const composedStyles = [...CHIP_COLORS, 'null'].reduce((prev, curr) => {
  prev[curr] = styles(curr as ChipColors | 'null');
  return prev;
}, {} as Record<string, ReturnType<typeof styles>>);

const themedProps = [...CHIP_COLORS, 'null'].reduce((prev, curr) => {
  prev[curr] = TEXT_COLOR_TYPES.reduce((prev2, curr2) => {
    prev2[curr2] = createThemedProps((theme) => ({
      android_ripple: {
        color:
          curr === 'null'
            ? undefined
            : theme.palette[curr as ChipColors][curr2],
      },
    }));
    return prev2;
  }, {} as Record<string, ReturnType<typeof createThemedProps<{ android_ripple: { color: string | undefined } }>>>);
  return prev;
}, {} as Record<string, Record<string, ReturnType<typeof createThemedProps<{ android_ripple: { color: string | undefined } }>>>>);

function Chip(props: ChipProps) {
  const {
    title,
    color,
    contrast: contrastProp,
    variant = 'outlined',
    icon,
    style: styleProp,
    textProps,
    ...rest
  } = props;
  const theme = useTheme();
  const contrast = useContrast(contrastProp);
  const style = useStyles(
    composedStyles[color == null ? 'null' : color],
    contrast,
  );
  const colorType = !contrast
    ? theme.mode === 'light'
      ? 'dark'
      : 'light'
    : theme.mode === 'dark'
    ? 'dark'
    : 'light';
  const { android_ripple } = useThemedProps(
    themedProps[color == null ? 'null' : color].main,
    contrast,
  );
  const pressableStyle = [style.chipPressable, styleProp];

  return (
    <View style={style[`chip_${variant}` as keyof typeof style]}>
      <Pressable
        {...rest}
        android_ripple={android_ripple}
        style={pressableStyle}
      >
        {icon != null &&
          React.cloneElement(icon, { size: 'small', color, colorType })}
        <Text variant="chip" color={color} colorType={colorType} {...textProps}>
          {title}
        </Text>
      </Pressable>
    </View>
  );
}

function Skeleton() {
  const contrast = useContrast();
  const style = useStyles(composedStyles['null'], contrast);
  const random = new Array(10)
    .fill('n[_>l'[Math.floor(Math.random() * 5)])
    .join('');
  return (
    <View style={style.skeleton}>
      <Text variant="chip" style={style.skeletonText}>
        {random}
      </Text>
    </View>
  );
}

const MemoizedChip = React.memo(Chip) as ReturnType<
  typeof React.memo<typeof Chip>
> & { Skeleton: ReturnType<typeof React.memo<typeof Skeleton>> };
MemoizedChip.Skeleton = React.memo(Skeleton);

export default MemoizedChip;
