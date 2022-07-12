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
  FloatingActionButtonWrapper,
} from './FloatingActionButton.base';
import { FloatingActionButtonProps, FloatingActionButtonRef } from './FloatingActionButton.interfaces';
import { NativeSyntheticEvent, TextLayoutEventData } from 'react-native';
import useMountedEffect from '@hooks/useMountedEffect';

const BUTTON_WIDTH = 56;

const FloatingActionButton: React.ForwardRefRenderFunction<FloatingActionButtonRef, FloatingActionButtonProps> = (
  props,
  ref
) => {
  const { title, icon, expand: show, onPress } = props;
  const [textWidth, setTextWidth] = React.useState<number>(0);
  const handleOnTextLayout = (e: NativeSyntheticEvent<TextLayoutEventData>) => {
    setTextWidth(e.nativeEvent.lines.reduce((total, curr) => total + curr.width, 0));
  };
  const width = useSharedValue(BUTTON_WIDTH);
  const opacity = useSharedValue(0);

  const styles = useAnimatedStyle(() => ({
    width: width.value,
  }));

  const mountStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  function collapse() {
    width.value = withTiming(BUTTON_WIDTH, { duration: 500, easing: Easing.ease });
    opacity.value = withSpring(0);
  }

  function expand() {
    width.value = withTiming(textWidth + BUTTON_WIDTH + 16, { duration: 500, easing: Easing.ease });
    opacity.value = withSpring(1);
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
    </FloatingActionButtonContainer>
  );
};

export default React.forwardRef(FloatingActionButton);
