import Box from '@components/Box';
import { useTheme } from '@emotion/react';
import React from 'react';
import {
  BorderlessButton,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { moderateScale } from 'react-native-size-matters';
import { SwitchProps } from './Switch.interfaces';

const leftScaled = moderateScale(8);
const rightScaled = moderateScale(22);
const Switch: React.FC<SwitchProps> = (props) => {
  const { enabled, onChange = () => void 0, color = 'primary' } = props;
  const theme = useTheme();
  React.useEffect(() => {
    if (enabled)
      state.value = withTiming(1, { duration: 150, easing: Easing.ease });
    else state.value = withTiming(0, { duration: 150, easing: Easing.ease });
  }, [enabled]);
  const state = useSharedValue(enabled ? 1 : 0);
  function onToggle() {
    if (state.value > 0) {
      state.value = withTiming(0, { duration: 150, easing: Easing.ease });
      onChange(false);
    } else {
      state.value = withTiming(1, { duration: 150, easing: Easing.ease });
      onChange(true);
    }
  }
  const left = useDerivedValue(() =>
    interpolate(state.value, [0, 1], [leftScaled, rightScaled]),
  );
  const switchColor = useDerivedValue(() =>
    interpolateColor(
      state.value,
      [0, 1],
      ['rgb(255, 255, 255)', theme.palette[color].main],
    ),
  );
  const backgroundColor = useDerivedValue(() =>
    interpolateColor(
      state.value,
      [0, 1],
      [theme.palette.background.disabled, theme.palette[color].dark],
    ),
  );
  const switchStyle = useAnimatedStyle(() => ({
    left: left.value,
  }));
  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));
  const switchCircleStyle = useAnimatedStyle(() => ({
    backgroundColor: switchColor.value,
  }));
  return (
    <Box
      flex-direction="column"
      justify-content="center"
      overflow="visible"
      height={moderateScale(36)}
      width={moderateScale(50)}
    >
      <TouchableWithoutFeedback onPress={onToggle}>
        <Box
          width={moderateScale(34)}
          height={moderateScale(16)}
          align-self="center"
          border-radius={1000}
          as={Animated.View}
          style={backgroundStyle}
        />
      </TouchableWithoutFeedback>
      <Box position="absolute" as={Animated.View} style={switchStyle}>
        <BorderlessButton
          shouldCancelWhenOutside
          onPress={onToggle}
          rippleRadius={moderateScale(18)}
          rippleColor={theme.helpers.getRippleColor(color)}
        >
          <Box
            as={Animated.View}
            style={switchCircleStyle}
            box-shadow
            border-radius={1000}
            width={moderateScale(20)}
            height={moderateScale(20)}
          />
        </BorderlessButton>
      </Box>
    </Box>
  );
};

export default Switch;
