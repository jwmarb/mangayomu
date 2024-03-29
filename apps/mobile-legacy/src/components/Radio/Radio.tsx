import React from 'react';
import { RadioProps, BaseRadioProps } from './';
import { useRadioGroup } from '@components/RadioGroup';
import { AnimatedBox } from '@components/Box';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';
import Stack from '@components/Stack';
import Text from '@components/Text';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@emotion/react';
import Pressable from '@components/Pressable';

const styles = ScaledSheet.create({
  button: {
    width: '22@ms' as unknown as number,
    height: '22@ms' as unknown as number,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio: {
    borderRadius: 10000,
    width: '12@ms' as unknown as number,
    height: '12@ms' as unknown as number,
  },
});

const Radio: React.FC<BaseRadioProps> = React.memo((props) => {
  const { isSelected, onChange: _onChange, label, onPress } = props;
  const theme = useTheme();
  const state = useSharedValue(isSelected ? 1 : 0);
  const backgroundColor = useDerivedValue(() =>
    interpolateColor(
      state.value,
      [0, 1],
      ['transparent', theme.palette.primary.main],
    ),
  );
  const borderColor = useDerivedValue(() =>
    interpolateColor(
      state.value,
      [0, 1],
      [theme.palette.borderColor, theme.palette.primary.main],
    ),
  );
  function onChange() {
    if (onPress != null) onPress();
    _onChange();
    state.value = withTiming(1, { duration: 200 });
  }
  React.useEffect(() => {
    if (!isSelected) state.value = withTiming(0, { duration: 100 });
    else state.value = withTiming(1, { duration: 200 });
  }, [isSelected]);
  const radioStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));
  const radioContainerStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
  }));

  const combinedRadioStyle = React.useMemo(
    () => [radioStyle, styles.radio],
    [radioStyle, styles.radio],
  );
  return (
    <Pressable ripple={false} onPress={onChange} disabled={isSelected}>
      <Stack
        flex-direction="row"
        space="s"
        align-items="center"
        justify-content="center"
      >
        <Pressable
          borderless
          disabled={isSelected}
          style={styles.button}
          onPress={onChange}
        >
          <AnimatedBox
            border-color="disabled"
            border-width="@theme"
            style={radioContainerStyle}
            align-self="center"
            border-radius={100000}
            // background-color={
            //   theme.mode === 'light'
            //     ? 'rgba(0, 0, 0, 0.1)'
            //     : 'rgba(255, 255, 255, 0.1)'
            // }
            p={moderateScale(3)}
          >
            <Animated.View style={combinedRadioStyle} />
          </AnimatedBox>
        </Pressable>
        <Text>{label}</Text>
      </Stack>
    </Pressable>
  );
});

const RadioContextReceiver: React.FC<RadioProps> = ({
  value: providedValue,
  label,
  onPress,
}) => {
  const { value, onChange } = useRadioGroup();
  const handleOnChange = React.useCallback(() => {
    onChange(providedValue);
  }, [onChange, providedValue]);
  const isSelected = value === providedValue;
  return (
    <Radio
      isSelected={isSelected}
      onChange={handleOnChange}
      label={label}
      onPress={onPress}
    />
  );
};
export default RadioContextReceiver;
