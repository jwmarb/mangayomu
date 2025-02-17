import { PressableAndroidRippleConfig } from 'react-native';
import {
  Pressable as NativePressable,
  PressableProps as NativePressableProps,
} from 'react-native-gesture-handler';
import { pressableStyles } from '@/components/primitives/Pressable/styles';
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

  const { android_ripple, style: styleProp, ...rest } = props;
  const style: NativePressableProps['style'] =
    typeof styleProp === 'function'
      ? (state) => [pressableStyles.container, styleProp(state)]
      : [pressableStyles.container, styleProp];

  const ripple = { ...androidRipple, ...android_ripple };

  return <NativePressable {...rest} style={style} android_ripple={ripple} />;
}
