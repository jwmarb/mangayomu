import React from 'react';
import { RadioProps, BaseRadioProps } from './Radio.interfaces';
import { useRadioGroup } from '@components/RadioGroup';
import Box from '@components/Box';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import {
  BorderlessButton,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@emotion/react';

const styles = ScaledSheet.create({
  button: {
    width: '22@ms',
    height: '22@ms',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio: {
    borderRadius: 10000,
    width: '12@ms',
    height: '12@ms',
  },
});

const Radio: React.FC<BaseRadioProps> = React.memo((props) => {
  const { isSelected, onChange: _onChange, label } = props;
  const theme = useTheme();
  const state = useSharedValue(isSelected ? 1 : 0);
  const backgroundColor = useDerivedValue(() =>
    interpolateColor(
      state.value,
      [0, 1],
      ['transparent', theme.palette.primary.main],
    ),
  );
  function onChange() {
    _onChange();
    state.value = withTiming(1, { duration: 200 });
  }
  React.useEffect(() => {
    if (!isSelected) state.value = withTiming(0, { duration: 100 });
  }, [isSelected]);
  const radioStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));

  const combinedRadioStyle = React.useMemo(
    () => [radioStyle, styles.radio],
    [radioStyle, styles.radio],
  );
  return (
    <TouchableWithoutFeedback onPress={onChange} disabled={isSelected}>
      <Stack
        flex-direction="row"
        space="s"
        align-items="center"
        justify-content="center"
      >
        <BorderlessButton
          enabled={!isSelected}
          style={styles.button}
          rippleColor={theme.palette.action.ripple}
          onPress={onChange}
        >
          <Box
            border-color="disabled"
            border-width={moderateScale(1.5)}
            align-self="center"
            border-radius={100000}
            p={moderateScale(3)}
          >
            <Animated.View style={combinedRadioStyle} />
          </Box>
        </BorderlessButton>
        <Text>{label}</Text>
      </Stack>
    </TouchableWithoutFeedback>
  );
});

const RadioContextReceiver: React.FC<RadioProps> = ({
  value: providedValue,
  label,
}) => {
  const { value, onChange } = useRadioGroup();
  const handleOnChange = React.useCallback(() => {
    onChange(providedValue);
  }, [onChange, providedValue]);
  const isSelected = value === providedValue;
  return (
    <Radio isSelected={isSelected} onChange={handleOnChange} label={label} />
  );
};
export default RadioContextReceiver;
