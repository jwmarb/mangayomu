import { useTheme } from '@emotion/react';
import { BottomSheetHandleProps } from '@gorhom/bottom-sheet';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CustomHandle({
  animatedIndex,
}: BottomSheetHandleProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const indicatorHeight = useDerivedValue(() =>
    interpolate(animatedIndex.value, [1.8, 2], [0, insets.top]),
  );
  const style = useAnimatedStyle(() => ({
    height: indicatorHeight.value,
  }));
  const styles = [
    style,
    {
      backgroundColor: theme.palette.background.paper,
    },
  ];
  return <Animated.View style={styles} />;
}
