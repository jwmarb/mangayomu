import React from 'react';
import { RectButton } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Icon from '@components/Icon';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';

export interface SortItemProps<T extends string> {
  reversed: boolean;
  isSelected: boolean;
  title: T;
  onChange: (i: T) => void;
  onToggleReverse: () => void;
}

function SortItem<T extends string>(props: SortItemProps<T>) {
  const theme = useTheme();
  const textColor = useDerivedValue(() =>
    interpolateColor(
      props.isSelected ? 1 : 0,
      [0, 1],
      [theme.palette.text.secondary, theme.palette.primary.main],
    ),
  );
  const rotation = useSharedValue(props.reversed ? 180 : 0);
  const textStyle = useAnimatedStyle(() => ({
    color: textColor.value,
  }));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: rotation.value + 'deg' }],
    opacity: props.isSelected ? 1 : 0,
  }));

  React.useEffect(() => {
    if (props.reversed)
      rotation.value = withTiming(180, { duration: 150, easing: Easing.ease });
    else rotation.value = withTiming(0, { duration: 150, easing: Easing.ease });
  }, [props.reversed]);
  function handleOnPress() {
    if (!props.isSelected) props.onChange(props.title);
    else props.onToggleReverse();
  }
  return (
    <RectButton
      shouldCancelWhenOutside
      onPress={handleOnPress}
      rippleColor={theme.palette.action.ripple}
    >
      <Stack p="m" space="m" flex-direction="row" align-items="center">
        <Animated.View style={iconStyle}>
          <Icon type="font" name="arrow-up" color="primary" />
        </Animated.View>
        <Text as={Animated.Text} style={textStyle}>
          {props.title}
        </Text>
      </Stack>
    </RectButton>
  );
}

export default React.memo(SortItem) as typeof SortItem;
