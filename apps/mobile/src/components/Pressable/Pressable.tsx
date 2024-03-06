import {
  Pressable as NativePressable,
  PressableAndroidRippleConfig,
  PressableProps as NativePressableProps,
} from 'react-native';
import { pressableStyles } from '@/components/Pressable/styles';
import { createThemedProps } from '@/utils/theme';
import useThemedProps from '@/hooks/useThemedProps';
import useContrast from '@/hooks/useContrast';

const themedProps = createThemedProps((theme) => ({
  androidRipple: {
    borderless: false,
    color: theme.palette.action.ripple,
    foreground: false,
  } as PressableAndroidRippleConfig,
}));

export type PressableProps = NativePressableProps & {
  contrast?: boolean;
};

/**
 * A basic Pressable component with essential theming applied to it. It is the fundamental building block of every component that requires user interaction.
 * @returns
 */
export default function Pressable(props: PressableProps) {
  const contrast = useContrast(props.contrast);
  const { androidRipple } = useThemedProps(themedProps, contrast);
  props.android_ripple = {
    ...props.android_ripple,
    ...androidRipple,
  };
  const { android_ripple, style: styleProp, ...rest } = props;
  const style: NativePressableProps['style'] =
    typeof styleProp === 'function'
      ? (state) => [pressableStyles.container, styleProp(state)]
      : [pressableStyles.container, styleProp];

  return (
    <NativePressable {...rest} style={style} android_ripple={android_ripple} />
  );
}
