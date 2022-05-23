import ButtonBase from '@components/Button/ButtonBase';
import React from 'react';
import { Icon, Typography, Flex, Spacer } from '@components/core';
import {
  FloatingContainer,
  FloatingActionButtonContainer,
  FloatingActionButtonBase,
} from './FloatingActionButton.base';
import { FloatingActionButtonProps } from './FloatingActionButton.interfaces';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming, Easing } from 'react-native-reanimated';
import useAnimatedMounting from '@hooks/useAnimatedMounting';
import { LayoutChangeEvent, NativeSyntheticEvent, TextLayoutEventData } from 'react-native';
import useMountedEffect from '@hooks/useMountedEffect';
import { useTheme } from 'styled-components/native';

const BUTTON_WIDTH = 56;

const FloatingActionButton: React.FC<FloatingActionButtonProps> = (props) => {
  const { isAtBeginning, currentChapter } = props;
  const [textWidth, setTextWidth] = React.useState<number>(0);
  const width = useSharedValue(BUTTON_WIDTH);
  const opacity = useSharedValue(0);
  const theme = useTheme();

  useMountedEffect(() => {
    if (!isAtBeginning) {
      width.value = withTiming(textWidth + BUTTON_WIDTH + 16, { duration: 500, easing: Easing.ease });
      opacity.value = withSpring(1);
    } else {
      width.value = withTiming(BUTTON_WIDTH, { duration: 500, easing: Easing.ease });
      opacity.value = withSpring(0);
    }
  }, [isAtBeginning]);

  const styles = useAnimatedStyle(() => ({
    width: width.value,
  }));

  const mountStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  function onTextLayout(e: NativeSyntheticEvent<TextLayoutEventData>) {
    setTextWidth(e.nativeEvent.lines.reduce((total, curr) => total + curr.width, 0));
  }

  return (
    <FloatingContainer>
      <FloatingActionButtonContainer>
        <ButtonBase round onPress={() => {}} color='primary'>
          <FloatingActionButtonBase style={styles}>
            <Flex alignItems='center'>
              <Icon bundle='MaterialCommunityIcons' name='play' color={theme.palette.primary.main.getContrastText()} />
              <Spacer x={1} />
              <Animated.View style={mountStyles}>
                <Typography
                  variant='button'
                  numberOfLines={1}
                  onTextLayout={onTextLayout}
                  color={theme.palette.primary.main.getContrastText()}>
                  {currentChapter?.name ?? 'Read'}
                </Typography>
              </Animated.View>
            </Flex>
          </FloatingActionButtonBase>
        </ButtonBase>
      </FloatingActionButtonContainer>
    </FloatingContainer>
  );
};

export default React.memo(FloatingActionButton);
