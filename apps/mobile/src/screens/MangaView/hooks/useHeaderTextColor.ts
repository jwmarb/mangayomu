import {
  SharedValue,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import useCollapsibleBackgroundInterpolation from '@/hooks/useCollapsibleBackgroundInterpolation';
import useTheme from '@/hooks/useTheme';

export default function useHeaderTextColor(scrollOffset: SharedValue<number>) {
  const inputValues = useCollapsibleBackgroundInterpolation();
  const theme = useTheme();
  const white = theme.helpers.getContrastText('#000000');
  const color = useDerivedValue(() =>
    interpolateColor(scrollOffset.value, inputValues, [
      white,
      theme.palette.text.primary,
    ]),
  );
  const style = useAnimatedStyle(() => ({
    color: color.value,
  }));
  return style;
}
