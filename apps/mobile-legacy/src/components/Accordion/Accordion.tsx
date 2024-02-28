import Box from '@components/Box';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import Stack from '@components/Stack';
import Text from '@components/Text';
import React from 'react';
import { Freeze } from 'react-freeze';
import { LayoutChangeEvent, TextProps, ViewProps } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StackProps } from '@components/Stack';

export interface AccordionProps extends React.PropsWithChildren {
  /**
   * The accordion's title that will be shown to the user
   */
  title: string;
  /**
   * Props that will be passed to the `Text` component
   */
  textProps?: TextProps;
  /**
   * Props that will be passed to the container
   */
  containerProps?: StackProps;
  /**
   * The default state of the Accordion, whether it should initially be collapsed or expanded
   */
  defaultState?: 'expanded' | 'collapsed';
}

export interface AccordionMethods {
  /**
   * Expands the accordion
   */
  expand: () => void;
  /**
   * Collapses the accordion
   */
  collapse: () => void;
  /**
   * Toggles between the expanded or collapsed state
   */
  toggle: () => void;
}

const Accordion: React.ForwardRefRenderFunction<
  AccordionMethods,
  AccordionProps
> = (props, ref) => {
  const {
    title,
    textProps,
    containerProps,
    children,
    defaultState = 'expanded',
  } = props;
  const [height, setHeight] = React.useState<number | undefined>(undefined);
  const [pointerEvents, setPointerEvents] = React.useState<
    ViewProps['pointerEvents']
  >(defaultState === 'collapsed' ? 'none' : 'auto');

  const rotate = useSharedValue<number>(defaultState === 'collapsed' ? 180 : 0);
  const containerHeight = useDerivedValue(() =>
    interpolate(rotate.value, [0, 180], [height ?? 0, 0]),
  );
  const opacity = useDerivedValue(() =>
    interpolate(rotate.value, [0, 180], [1, 0]),
  );
  function collapse() {
    rotate.value = withTiming(180, { duration: 150, easing: Easing.ease });
    setPointerEvents('none');
  }
  function expand() {
    rotate.value = withTiming(0, { duration: 150, easing: Easing.ease });
    setPointerEvents('auto');
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
      <Animated.View pointerEvents={pointerEvents} style={collapsibleStyle}>
        {children}
      </Animated.View>
      <Freeze freeze={typeof height === 'number'}>
        <Box position="absolute" onLayout={handleOnLayout}>
          {children}
        </Box>
      </Freeze>
    </Box>
  );
};

export default React.forwardRef(Accordion);
