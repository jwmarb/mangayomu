import { useTheme } from '@emotion/react';
import { PaginationCircleProps } from '@screens/Welcome/components/PaginationCircle/PaginationCircle.interfaces';
import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import { moderateScale } from 'react-native-size-matters';

const PaginationCircle: React.FC<PaginationCircleProps> = ({
  scrollPosition,
  index,
}) => {
  const { width } = useWindowDimensions();
  const theme = useTheme();

  const opacity = useDerivedValue(
    () =>
      interpolate(
        scrollPosition.value,
        [width * (index - 1), width * index, width * (index + 1)],
        [0, 1, 0],
      ),
    [width],
  );

  const style = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      opacity.value,
      [0, 1],
      [theme.palette.background.disabled, theme.palette.primary.main],
    ),

    transform: [{ scale: 1 + 0.125 * opacity.value }],
  }));

  const paginationStyle = React.useMemo(
    () => [style, styles.paginationCircle, { width: moderateScale(12) }],
    [style],
  );

  return <Animated.View style={paginationStyle} />;
};

const styles = StyleSheet.create({
  paginationCircle: {
    height: 4,
    borderRadius: 1000,
  },
});

export default PaginationCircle;
