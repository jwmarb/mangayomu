import {
  Pressable as NativePressable,
  PressableAndroidRippleConfig,
  PressableProps as NativePressableProps,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { createThemedProps } from '../../utils/theme';
import { pressableStyles } from './styles';
import useThemedProps from '../../hooks/useThemedProps';

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

export default function Pressable(props: PressableProps) {
  const { androidRipple } = useThemedProps(themedProps, props.contrast);
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
