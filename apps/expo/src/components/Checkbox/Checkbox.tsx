import ButtonBase from '@components/Button/ButtonBase';
import { CheckboxBorder, CheckboxContainer } from '@components/Checkbox/Checkbox.base';
import Flex from '@components/Flex';
import Icon from '@components/Icon';
import { Typography } from '@components/Typography';
import useMountedEffect from '@hooks/useMountedEffect';
import React from 'react';
import { cancelAnimation, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { CheckboxProps } from './Checkbox.interfaces';
import Animated from 'react-native-reanimated';
import { useTheme } from 'styled-components/native';
import { Constants } from '@theme/core';
import { RFValue } from 'react-native-responsive-fontsize';

const Checkbox: React.FC<CheckboxProps> = (props) => {
  const { checked, onChange = () => void 0, onLongPress, useGestureHandler } = props;
  function handleOnPress() {
    onChange(!checked);
  }
  const theme = useTheme();
  const scale = useSharedValue(1);
  const checkScale = useSharedValue(checked ? RFValue(1) : 0);
  const borderWidth = useSharedValue(checked ? 0 : RFValue(1.5));
  const padding = useSharedValue(checked ? RFValue(1.5) : 0);
  const borderColor = useSharedValue(
    checked ? 'transparent' : Constants.GRAY[theme.palette.mode === 'light' ? 8 : 6].get()
  );
  const backgroundColor = useSharedValue(checked ? theme.palette.primary.main.get() : 'transparent');
  useMountedEffect(() => {
    scale.value = withSpring(1.2, undefined, (finished) => {
      if (finished) scale.value = withSpring(1);
    });
    if (checked) {
      checkScale.value = withSpring(1);
      borderColor.value = theme.palette.primary.main.get();
      backgroundColor.value = theme.palette.primary.main.get();
      borderWidth.value = 0;
      padding.value = RFValue(1.5);
    } else {
      checkScale.value = withSpring(0);
      borderWidth.value = RFValue(1.5);
      padding.value = 0;
      borderColor.value = Constants.GRAY[theme.palette.mode === 'light' ? 8 : 6].get();
      backgroundColor.value = 'transparent';
    }
    // return () => {
    //   cancelAnimation(padding);
    //   cancelAnimation(borderWidth);
    //   cancelAnimation(backgroundColor);
    //   cancelAnimation(borderColor);
    //   cancelAnimation(opacity);
    // };
  }, [checked]);

  const iconStyles = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const checkboxStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
    backgroundColor: backgroundColor.value,
    borderWidth: borderWidth.value,
    padding: padding.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <ButtonBase onPress={handleOnPress} round onLongPress={onLongPress} useGestureHandler={useGestureHandler}>
      <CheckboxContainer>
        <CheckboxBorder style={checkboxStyle}>
          <Animated.View style={iconStyles}>
            <Icon
              bundle='MaterialCommunityIcons'
              name='check-bold'
              size='checkbox'
              color={theme.palette.background.paper}
            />
          </Animated.View>
        </CheckboxBorder>
      </CheckboxContainer>
    </ButtonBase>
  );
};

export default Checkbox;
