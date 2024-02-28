import Icon from '@components/Icon';
import Pressable from '@components/Pressable';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import React from 'react';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';

export interface SelectItemProps<T extends string> {
  isSelected: boolean;
  title: string;
  itemKey: T;
  onChange: (itemKey: T) => void;
}

function SelectItem<T extends string>(props: SelectItemProps<T>) {
  const theme = useTheme();
  const textColor = useDerivedValue(() =>
    interpolateColor(
      props.isSelected ? 1 : 0,
      [0, 1],
      [theme.palette.text.secondary, theme.palette.primary.main],
    ),
  );
  const textStyle = useAnimatedStyle(() => ({
    color: textColor.value,
  }));
  const iconStyle = useAnimatedStyle(() => ({
    opacity: props.isSelected ? 1 : 0,
  }));
  function handleOnPress() {
    props.onChange(props.itemKey);
  }
  return (
    <Pressable onPress={handleOnPress}>
      <Stack p="m" space="m" flex-direction="row" align-items="center">
        <Animated.View style={iconStyle}>
          <Icon type="font" name="check" color="primary" />
        </Animated.View>
        <Text as={Animated.Text} style={textStyle}>
          {props.title}
        </Text>
      </Stack>
    </Pressable>
  );
}

export default React.memo(SelectItem) as typeof SelectItem;
