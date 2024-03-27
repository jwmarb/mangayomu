import { TextProps as NativeTextProps, Text as NativeText } from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';
import useContrast from '@/hooks/useContrast';
import {
  TextVariants,
  TextAlignments,
  TextColors,
  TEXT_COLOR_TYPES,
} from '@/components/primitives/types';
import useStyles from '@/hooks/useStyles';
import {
  variants,
  colors,
  alignments,
  decorators,
} from '@/components/primitives/Text/styles';

export type TextProps = NativeTextProps & {
  variant?: TextVariants;
  color?: TextColors;
  alignment?: TextAlignments;
  contrast?: boolean;
  bold?: boolean;
  italic?: boolean;
  colorType?: 'light' | 'dark' | 'main';
};

export const composedColors = TEXT_COLOR_TYPES.reduce((prev, curr) => {
  prev[curr] = colors(curr);
  return prev;
}, {} as Record<string, ReturnType<typeof colors>>);

/**
 * Text component to render text.
 */
function Text(props: TextProps, ref: React.ForwardedRef<NativeText>) {
  const {
    variant: variantProp = 'body1',
    color: colorProp = 'textPrimary',
    colorType = 'main',
    alignment: alignmentProp = 'left',
    contrast: contrastProp,
    bold,
    italic,
    ...rest
  } = props;
  const contrast = useContrast(contrastProp);
  const color = useStyles(composedColors[colorType], contrast)[colorProp];
  const alignment = alignments[alignmentProp];
  const variant = variants[variantProp];
  const style = [
    variant,
    color,
    alignment,
    bold ? decorators.bold : [],
    italic ? decorators.italic : [],
    rest.style,
  ];
  return <NativeText {...rest} style={style} ref={ref} />;
}

const ForwardedText = React.forwardRef(Text);

export const AnimatedText = Animated.createAnimatedComponent(ForwardedText);

export default ForwardedText;
