import Box from '@components/Box';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import React from 'react';
import { LayoutChangeEvent, NativeSyntheticEvent } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { AccordionProps, AccordionMethods } from './Accordion.interfaces';

const Accordion: React.ForwardRefRenderFunction<
  AccordionMethods,
  AccordionProps
> = (props, ref) => {
  const { title, textProps, containerProps, children } = props;
  const [height, setHeight] = React.useState<number | undefined>(undefined);

  const rotate = useSharedValue<number>(0);
  const containerHeight = useDerivedValue(() =>
    interpolate(rotate.value, [0, 180], [height ?? 0, 0]),
  );
  const opacity = useDerivedValue(() =>
    interpolate(rotate.value, [0, 180], [1, 0]),
  );
  function collapse() {
    rotate.value = withTiming(180, { duration: 150, easing: Easing.ease });
  }
  function expand() {
    rotate.value = withTiming(0, { duration: 150, easing: Easing.ease });
  }
  function toggle() {
    if (rotate.value === 180) expand();
    else collapse();
  }

  function handleOnLayout(e: LayoutChangeEvent) {
    setHeight((x) => x ?? e.nativeEvent.layout.height);
  }
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: rotate.value + 'deg' }],
  }));
  const collapsibleStyle = useAnimatedStyle(() => ({
    height: height == null ? undefined : containerHeight.value,
    opacity: opacity.value,
  }));

  React.useImperativeHandle(ref, () => ({
    collapse,
    expand,
    toggle,
  }));
  return (
    <Box>
      <TouchableWithoutFeedback onPress={toggle}>
        <Stack
          flex-direction="row"
          space="s"
          justify-content="space-between"
          align-items="center"
          {...containerProps}
        >
          <Text bold {...textProps}>
            {title}
          </Text>
          <IconButton
            icon={<Icon style={iconStyle} type="font" name="chevron-down" />}
            animated
            onPress={toggle}
            compact
          />
        </Stack>
      </TouchableWithoutFeedback>
      <Animated.View
        onLayout={handleOnLayout}
        pointerEvents={rotate.value === 180 ? 'auto' : 'none'}
        style={collapsibleStyle}
      >
        {children}
      </Animated.View>
    </Box>
  );
};

export default React.forwardRef(Accordion);