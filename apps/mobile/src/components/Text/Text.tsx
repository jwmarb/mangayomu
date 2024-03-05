import React from 'react';
import { TextProps as NativeTextProps, Text as NativeText } from 'react-native';
import { variants, colors, alignments } from './styles';
import useStyles from '../../hooks/useStyles';
import { TextVariants, TextAlignments, TextColors } from '../types';
import useContrast from '../../hooks/useContrast';

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
    contrast: contrastProp,
    ...rest
  } = props;
  const contrast = useContrast(contrastProp);
  const color = useStyles(colors, contrast)[colorProp];
  const alignment = alignments[alignmentProp];
  const variant = variants[variantProp];
  const style = [variant, color, alignment, rest.style];
  return <NativeText {...rest} style={style} ref={ref} />;
}

export default React.forwardRef(Text);
