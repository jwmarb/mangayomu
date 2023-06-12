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
import { CheckboxProps } from './Checkbox.interfaces';

const Checkbox: React.FC<CheckboxProps> = (props) => {
  const { checked, onChange = () => void 0, defaultState = false } = props;
  const theme = useTheme();
  const opacity = useSharedValue(defaultState || checked ? 1 : 0);
  const backgroundColor = useDerivedValue(() =>
    interpolateColor(
      opacity.value,
      [0, 1],
      [
        theme.mode === 'light'
          ? 'rgba(0, 0, 0, 0.15)'
          : 'rgba(255, 255, 255, 0.1)',
        theme.palette.primary.main,
      ],
    ),
  );
  const boxStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));
  const checkmarkStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  React.useEffect(() => {
    if (checked != null) {
      if (!checked) opacity.value = withTiming(0, { duration: 100 });
      else opacity.value = withTiming(1, { duration: 100 });
    }
  }, [checked]);

  function handleOnPress() {
    if (checked == null) {
      if (opacity.value === 1) {
        onChange(false);
        opacity.value = withTiming(0, { duration: 100 });
      } else {
        onChange(true);
        opacity.value = withTiming(1, { duration: 100 });
      }
    } else onChange(!checked);
  }
  return (
    <Box border-radius={10000}>
      <BorderlessButton
        shouldCancelWhenOutside
        onPress={handleOnPress}
        style={styles.borderlessButton}
      >
        <Box
          as={Animated.View}
          p={moderateScale(1)}
          align-self="center"
          border-radius={moderateScale(4)}
          justify-content="center"
          style={boxStyle}
        >
          <Animated.View style={checkmarkStyle}>
            <Icon type="font" name="check-bold" color="primary@contrast" />
          </Animated.View>
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

export default Checkbox;
