import { Switch as NativeSwitch } from 'react-native-gesture-handler';
import { SwitchProps as NativeSwitchProps } from 'react-native';
import { createThemedProps } from '@/utils/theme';
import useThemedProps from '@/hooks/useThemedProps';
import useContrast from '@/hooks/useContrast';
import useTheme from '@/hooks/useTheme';
import { AppColor } from '@/components/primitives/types';

const switchProps = createThemedProps((theme) => (color: AppColor) => ({
  trackColor: {
    false: undefined,
    true: theme.palette[color].ripple,
  },
}));

export type SwitchProps = {
  color?: AppColor;
} & NativeSwitchProps;

export default function Switch(props: SwitchProps) {
  const { color = 'primary' } = props;
  const contrast = useContrast();
  const theme = useTheme();
  const { trackColor } = useThemedProps(switchProps, contrast)(color);
  const thumbColor = props.value ? theme.palette[color].main : undefined;
  return (
    <NativeSwitch {...props} trackColor={trackColor} thumbColor={thumbColor} />
  );
}
