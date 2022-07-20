import ButtonBase from '@components/Button/ButtonBase';
import React from 'react';
import { Icon, Typography, Flex, Spacer } from '@components/core';
import {
  FloatingContainer,
  FloatingActionButtonContainer,
  FloatingActionButtonBase,
  FloatingActionTextContainer,
  FloatingActionButtonContainerLayoutGetter,
} from './FloatingActionButton.base';
import { FloatingActionButtonProps } from './FloatingActionButton.interfaces';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
  cancelAnimation,
  FadeIn,
  FadeOut,
  FadeInRight,
  runOnJS,
} from 'react-native-reanimated';
import useAnimatedMounting from '@hooks/useAnimatedMounting';
import { LayoutChangeEvent, NativeSyntheticEvent, TextLayoutEventData } from 'react-native';
import useMountedEffect from '@hooks/useMountedEffect';
import { useTheme } from 'styled-components/native';
import { useSelector } from 'react-redux';
import { AppState } from '@redux/store';
import { RFValue } from 'react-native-responsive-fontsize';

const BUTTON_WIDTH = RFValue(41);

const FloatingActionButton: React.FC<FloatingActionButtonProps> = (props) => {
  const { isAtBeginning, currentChapter } = props;
  const [positionAbsolute, setPositionAbsolute] = React.useState<boolean>(true);
  const selectionMode = useSelector((state: AppState) => state.chaptersList.mode);
  const textWidth = React.useRef<number>(0);
  const buttonWidth = React.useRef<number>(0);
  const handleOnTextContainerLayout = (e: LayoutChangeEvent) => {
    textWidth.current = e.nativeEvent.layout.width;
  };
  const handleOnButtonContainerLayout = (e: LayoutChangeEvent) => {
    buttonWidth.current = e.nativeEvent.layout.width;
    width.value = e.nativeEvent.layout.width;
    containerOpacity.value = withSpring(1);
  };

  const theme = useTheme();
  const containerOpacity = useSharedValue(0);
  const width = useSharedValue(buttonWidth.current);
  const textOpacity = useSharedValue(0);

  function onFinish(finished?: boolean) {
    if (finished) setPositionAbsolute(true);
  }

  React.useEffect(() => {
    if (!isAtBeginning) {
      setPositionAbsolute(false);
      width.value = withTiming(buttonWidth.current + textWidth.current, { duration: 500, easing: Easing.ease });
      textOpacity.value = withTiming(1, { duration: 500, easing: Easing.ease });
    } else {
      width.value = withTiming(buttonWidth.current, { duration: 500, easing: Easing.ease });
      textOpacity.value = withTiming(0, { duration: 500, easing: Easing.ease }, (finished) => {
        runOnJS(onFinish)(finished);
      });
    }
    return () => {
      cancelAnimation(width);
      cancelAnimation(textOpacity);
    };
  }, [isAtBeginning]);

  useMountedEffect(() => {
    switch (selectionMode) {
      case 'normal':
        containerOpacity.value = withSpring(1);
        break;
      case 'selection':
        containerOpacity.value = withSpring(0);
        break;
    }
    return () => {
      cancelAnimation(containerOpacity);
    };
  }, [selectionMode]);

  const containerStyles = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const baseStyle = useAnimatedStyle(() => ({
    width: width.value,
  }));

  const textContainerStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <FloatingContainer>
      <FloatingActionButtonContainer style={containerStyles}>
        <ButtonBase round onPress={() => {}} color='primary'>
          <FloatingActionButtonBase style={baseStyle}>
            <Flex alignItems='center'>
              <Icon bundle='Feather' name='book' color={theme.palette.primary.main.getContrastText()} />
              <FloatingActionTextContainer
                style={textContainerStyle}
                positionAbsolute={positionAbsolute}
                onLayout={handleOnTextContainerLayout}>
                <Typography variant='button' numberOfLines={1} color={theme.palette.primary.main.getContrastText()}>
                  {currentChapter?.name ?? 'Read'}
                </Typography>
              </FloatingActionTextContainer>
            </Flex>
          </FloatingActionButtonBase>
        </ButtonBase>
      </FloatingActionButtonContainer>
      <FloatingActionButtonContainerLayoutGetter>
        <FloatingActionButtonBase onLayout={handleOnButtonContainerLayout}>
          <Flex alignItems='center'>
            <Icon bundle='Feather' name='book' color={theme.palette.primary.main.getContrastText()} />
          </Flex>
        </FloatingActionButtonBase>
      </FloatingActionButtonContainerLayoutGetter>
    </FloatingContainer>
  );
};

export default React.memo(FloatingActionButton);
