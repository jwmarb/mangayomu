import React from 'react';
import { PageSliderDecoratorsProps } from './PageSliderDecorators.interfaces';
import Box, { AnimatedBox } from '@components/Box/Box';
import SnapPoints from '@screens/Reader/components/Overlay/components/PageSliderNavigator/components/SnapPoints/SnapPoints';
import {
  BorderlessButton,
  GestureDetector,
} from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';
import { hexToRgb, rgbaToString } from '@mangayomu/theme';
import { useTheme } from '@emotion/react';
import Animated from 'react-native-reanimated';
import { OVERLAY_SLIDER_CIRCLE_DEFAULT_OFFSET } from '@theme/constants';

const AnimatedBorderlessButton =
  Animated.createAnimatedComponent(BorderlessButton);

const PageSliderDecorators: React.FC<PageSliderDecoratorsProps> = (props) => {
  const { onLayout, gesture, style, snapPointStyle, trailStyle } = props;
  const theme = useTheme();
  return (
    <Box
      onLayout={onLayout}
      height={moderateScale(4)}
      border-radius={10000}
      mx="m"
      flex-grow
      align-self="center"
      justify-content="center"
      overflow="visible"
      background-color={rgbaToString({
        ...hexToRgb(theme.palette.primary.main),
        alpha: 0.32,
      })}
    >
      <GestureDetector gesture={gesture}>
        <Box justify-content="center">
          <SnapPoints style={snapPointStyle} />
          <AnimatedBox
            position="absolute"
            background-color={theme.palette.primary.light}
            left={OVERLAY_SLIDER_CIRCLE_DEFAULT_OFFSET / 2}
            style={trailStyle}
            border-radius={10000}
            height={moderateScale(4)}
          ></AnimatedBox>
          <AnimatedBorderlessButton
            style={style}
            borderless
            foreground
            rippleColor={theme.palette.primary.light}
          >
            <Box
              align-self="center"
              height={moderateScale(22)}
              width={moderateScale(22)}
              background-color={theme.palette.primary.light}
              border-radius={10000}
            />
          </AnimatedBorderlessButton>
        </Box>
      </GestureDetector>
    </Box>
  );
};

export default React.memo(PageSliderDecorators);
