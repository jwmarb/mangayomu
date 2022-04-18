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
import { NativeSyntheticEvent, TextLayoutEventData } from 'react-native';
import useMountedEffect from '@hooks/useMountedEffect';

const FloatingActionButton: React.FC<FloatingActionButtonProps> = (props) => {
  const { isAtBeginning, currentChapter } = props;
  const [textWidth, setTextWidth] = React.useState<number>(0);
  const width = useSharedValue(56);
  const opacity = useSharedValue(0);

  useMountedEffect(() => {
    if (!isAtBeginning) {
      width.value = withTiming(textWidth + 72, { duration: 500, easing: Easing.ease });
      opacity.value = withSpring(1);
    } else {
      width.value = withTiming(56, { duration: 500, easing: Easing.ease });
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
    setTextWidth(e.nativeEvent.lines[0].width);
  }

  return (
    <FloatingContainer>
      <FloatingActionButtonContainer>
        <ButtonBase round onPress={() => {}} color='primary'>
          <FloatingActionButtonBase style={styles}>
            <Flex alignItems='center'>
              <Icon bundle='MaterialCommunityIcons' name='play' />
              <Spacer x={1} />
              <Animated.View style={mountStyles}>
                <Typography variant='button' numberOfLines={1} onTextLayout={onTextLayout}>
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
