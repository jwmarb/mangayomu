import Box from '@components/Box';
import Icon from '@components/Icon';
import { useTheme } from '@emotion/react';
import React from 'react';
import { BorderlessButton } from 'react-native-gesture-handler';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';
import { MultiCheckboxProps } from './MultiCheckbox.interfaces';

const MultiCheckbox: React.FC<MultiCheckboxProps> = (props) => {
  const {
    onChange = () => void 0,
    defaultState = 0,
    state = defaultState,
  } = props;
  const theme = useTheme();
  const checkOpacity = useSharedValue(state === 1 ? 1 : 0);
  const closeOpacity = useSharedValue(state === 2 ? 1 : 0);
  const backgroundColor = useDerivedValue(() =>
    interpolateColor(
      state,
      [0, 1, 2],
      [
        theme.mode === 'light'
          ? 'rgba(0, 0, 0, 0.15)'
          : 'rgba(255, 255, 255, 0.1)',
        theme.palette.primary.main,
        theme.palette.secondary.main,
      ],
    ),
  );

  const boxStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));
  const checkmarkStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
  }));
  const closeStyle = useAnimatedStyle(() => ({
    opacity: closeOpacity.value,
  }));
  const closeStyleFinal = React.useMemo(
    () => [closeStyle, { position: 'absolute', alignSelf: 'center' } as const],
    [closeStyle],
  );

  React.useEffect(() => {
    if (state === 1) checkOpacity.value = withTiming(1, { duration: 100 });
    else checkOpacity.value = withTiming(0, { duration: 100 });
    if (state === 2) closeOpacity.value = withTiming(1, { duration: 100 });
    else closeOpacity.value = withTiming(0, { duration: 100 });
  }, [state]);
  function handleOnPress() {
    switch (state) {
      case 0:
        onChange(1);
        break;
      case 1:
        onChange(2);
        break;
      case 2:
        onChange(0);
        break;
    }
  }
  return (
    <Box border-radius={10000}>
      <BorderlessButton onPress={handleOnPress} style={styles.borderlessButton}>
        <Box
          as={Animated.View}
          p={moderateScale(1)}
          align-self="center"
          border-radius={moderateScale(4)}
          justify-content="center"
          style={boxStyle}
        >
          <Icon
            type="font"
            name="check-bold"
            color="primary@contrast"
            animated
            style={checkmarkStyle}
          />
          <Icon
            animated
            style={closeStyleFinal}
            type="font"
            name="close-thick"
            color="secondary@contrast"
          />
        </Box>
      </BorderlessButton>
    </Box>
  );
};

const styles = ScaledSheet.create({
  borderlessButton: {
    width: '36@ms',
    height: '36@ms',
    borderRadius: 10000,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MultiCheckbox;
