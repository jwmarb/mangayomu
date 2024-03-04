import React from 'react';
import { TextProps as NativeTextProps, Text as NativeText } from 'react-native';
import { variants, colors, alignments } from './styles';
import useStyles from '../../hooks/useStyles';
import { APP_COLORS } from '../types';

export const TEXT_VARIANTS = [
  'h1',
  'h2',
  'h3',
  'body1',
  'body2',
  'button',
] as const;
export const TEXT_COLORS = [
  ...APP_COLORS,
  'textPrimary',
  'textSecondary',
  'disabled',
] as const;
export const TEXT_ALIGNMENTS = ['left', 'center', 'right'] as const;

export type TextVariants = (typeof TEXT_VARIANTS)[number];
export type TextColors = (typeof TEXT_COLORS)[number];
export type TextAlignments = (typeof TEXT_ALIGNMENTS)[number];
export type TextProps = NativeTextProps & {
  variant?: TextVariants;
  color?: TextColors;
  alignment?: TextAlignments;
  contrast?: boolean;
};

/**
 * Text component to render text.
 */
function Text(props: TextProps, ref: React.ForwardedRef<NativeText>) {
  const {
    variant: variantProp = 'body1',
    color: colorProp = 'textPrimary',
    alignment: alignmentProp = 'left',
    contrast = false,
    ...rest
  } = props;
  const color = useStyles(colors, contrast)[colorProp];
  const alignment = alignments[alignmentProp];
  const variant = variants[variantProp];
  const style = [variant, color, alignment, rest.style];
  return <NativeText {...rest} style={style} ref={ref} />;
}

export default React.forwardRef(Text);
