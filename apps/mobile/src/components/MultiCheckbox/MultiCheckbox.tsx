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
  const { state = 0, onChange = () => void 0, defaultState = 0 } = props;
  const theme = useTheme();
  const opacity = useSharedValue(defaultState | state);
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
  const textColor = React.useMemo(() => {
    switch (state) {
      case 1:
      default:
        return 'primary@contrast';
      case 2:
        return 'secondary@contrast';
    }
  }, [state]);
  const iconName = React.useMemo(() => {
    switch (state) {
      case 1:
      default:
        return 'check-bold';
      case 2:
        return 'close-thick';
    }
  }, [state]);
  const boxStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));
  const checkmarkStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  React.useEffect(() => {
    if (state === 0) opacity.value = withTiming(0, { duration: 100 });
    else opacity.value = withTiming(1, { duration: 100 });
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
          <Animated.View style={checkmarkStyle}>
            <Icon type="font" name={iconName} color={textColor} />
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

export default MultiCheckbox;
