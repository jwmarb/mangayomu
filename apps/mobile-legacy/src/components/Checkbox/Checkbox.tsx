import Box from '@components/Box';
import Icon from '@components/Icon';
import { useTheme } from '@emotion/react';
import React from 'react';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ScaledSheet } from 'react-native-size-matters';
import { CheckboxProps } from './';
import Pressable from '@components/Pressable';

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
  const containerStyle = useAnimatedStyle(() => ({
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

  const checkmarkContainerStyle = [containerStyle, styles.checkmarkContainer];

  return (
    <Box border-radius={10000}>
      <Pressable
        borderless
        onPress={handleOnPress}
        style={styles.borderlessButton}
      >
        <Animated.View style={checkmarkContainerStyle}>
          <Animated.View style={checkmarkStyle}>
            <Icon type="font" name="check-bold" color="primary@contrast" />
          </Animated.View>
        </Animated.View>
      </Pressable>
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
  checkmarkContainer: {
    padding: '1@ms',
    alignSelf: 'center',
    borderRadius: '4@ms',
    justifyContent: 'center',
  },
});

export default Checkbox;
