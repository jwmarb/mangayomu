import ButtonBase from '@components/Button/ButtonBase';
import Flex from '@components/Flex';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  withSpring,
  runOnJS,
  cancelAnimation,
} from 'react-native-reanimated';
import Spacer from '@components/Spacer';
import React from 'react';
import { Typography } from '../Typography';
import {
  FloatingActionButtonBase,
  FloatingActionButtonContainer,
  FloatingActionButtonLayoutGetter,
  FloatingActionButtonWrapper,
} from './FloatingActionButton.base';
import { FloatingActionButtonProps, FloatingActionButtonRef } from './FloatingActionButton.interfaces';
import { LayoutChangeEvent, NativeSyntheticEvent, TextLayoutEventData } from 'react-native';
import useMountedEffect from '@hooks/useMountedEffect';
import { Portal } from '@gorhom/portal';

const FloatingActionButton: React.ForwardRefRenderFunction<FloatingActionButtonRef, FloatingActionButtonProps> = (
  props,
  ref
) => {
  const { title, icon, expand: show, onPress } = props;
  const [textWidth, setTextWidth] = React.useState<number>(0);
  const handleOnTextLayout = (e: NativeSyntheticEvent<TextLayoutEventData>) => {
    setTextWidth(e.nativeEvent.lines.reduce((total, curr) => total + curr.width, 0));
  };
  const width = useSharedValue(0);
  const buttonWidth = useSharedValue(0);
  const opacity = useSharedValue(0);

  const styles = useAnimatedStyle(() => ({
    width: width.value,
  }));

  const mountStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  function collapse() {
    width.value = withTiming(buttonWidth.value, { duration: 500, easing: Easing.ease });
    opacity.value = withSpring(0);
  }

  function expand() {
    width.value = withTiming(textWidth + buttonWidth.value + 16, { duration: 500, easing: Easing.ease });
    opacity.value = withSpring(1);
  }

  function handleOnButtonLayout(e: LayoutChangeEvent) {
    width.value = e.nativeEvent.layout.width;
    buttonWidth.value = e.nativeEvent.layout.width;
  }

  useMountedEffect(() => {
    if (show) expand();
    else collapse();
    // return () => {
    //   cancelAnimation(width);
    //   cancelAnimation(opacity);
    // };
  }, [show]);

  React.useImperativeHandle(ref, () => ({
    collapse,
    expand,
  }));
  return (
    <Portal>
      <FloatingActionButtonContainer>
        <FloatingActionButtonWrapper>
          <ButtonBase round color='primary' onPress={onPress}>
            <FloatingActionButtonBase style={styles}>
              <Flex alignItems='center'>
                {icon}
                <Spacer x={1} />
                <Animated.View style={mountStyles}>
                  <Typography variant='button' numberOfLines={1} onTextLayout={handleOnTextLayout}>
                    {title}
                  </Typography>
                </Animated.View>
              </Flex>
            </FloatingActionButtonBase>
          </ButtonBase>
        </FloatingActionButtonWrapper>
        <FloatingActionButtonLayoutGetter>
          <FloatingActionButtonBase onLayout={handleOnButtonLayout}>
            <Flex alignItems='center'>{icon}</Flex>
          </FloatingActionButtonBase>
        </FloatingActionButtonLayoutGetter>
      </FloatingActionButtonContainer>
    </Portal>
  );
};

export default React.forwardRef(FloatingActionButton);
