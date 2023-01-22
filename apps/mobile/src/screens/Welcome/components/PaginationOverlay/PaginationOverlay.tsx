import Box from '@components/Box';
import { Stack } from '@components/Stack';
import PaginationCircle from '@screens/Welcome/components/PaginationCircle';
import React from 'react';
import { Dimensions, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';
import { PaginationOverlayProps } from './PaginationOverlay.interfaces';

const styles = ScaledSheet.create({
  container: {
    width: '150@ms',
    alignSelf: 'center',
  },
});

const PaginationOverlay: React.FC<PaginationOverlayProps> = (props) => {
  const { scrollPosition } = props;
  const { width, height } = useWindowDimensions();
  const marginBottom = useSharedValue(
    width > height ? moderateScale(100) : moderateScale(20),
  );
  React.useLayoutEffect(() => {
    const p = Dimensions.addEventListener('change', ({ window }) => {
      const isPortrait = window.width < window.height;
      const isLandscape = window.width > window.height;
      if (isPortrait) marginBottom.value = moderateScale(100);
      if (isLandscape) marginBottom.value = moderateScale(20);
    });
    return () => {
      p.remove();
    };
  });
  const style = useAnimatedStyle(() => ({
    marginBottom: marginBottom.value,
  }));
  const containerStyle = React.useMemo(
    () => [style, styles.container],
    [styles.container, style],
  );
  return (
    <Box
      position="absolute"
      top={0}
      bottom={0}
      left={0}
      right={0}
      width={width}
      height={height}
      pointerEvents="box-none"
      justify-content="flex-end"
    >
      <Animated.View style={containerStyle}>
        <Stack
          flex-direction="row"
          space="l"
          align-items="center"
          justify-content="center"
        >
          <Stack
            flex-direction="row"
            align-items="center"
            justify-content="center"
            space={moderateScale(12)}
          >
            <PaginationCircle index={0} scrollPosition={scrollPosition} />
            <PaginationCircle index={1} scrollPosition={scrollPosition} />
            <PaginationCircle index={2} scrollPosition={scrollPosition} />
            <PaginationCircle index={3} scrollPosition={scrollPosition} />
          </Stack>
        </Stack>
      </Animated.View>
    </Box>
  );
};

export default PaginationOverlay;
