import ButtonBase from '@components/Button/ButtonBase';
import { CheckboxBorder, CheckboxContainer } from '@components/Checkbox/Checkbox.base';
import Flex from '@components/Flex';
import Icon from '@components/Icon';
import { Typography } from '@components/Typography';
import useMountedEffect from '@hooks/useMountedEffect';
import React from 'react';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { CheckboxProps } from './Checkbox.interfaces';
import Animated from 'react-native-reanimated';
import { useTheme } from 'styled-components/native';
import { Constants } from '@theme/core';

const Checkbox: React.FC<CheckboxProps> = (props) => {
  const { checked, onChange = () => void 0 } = props;
  function handleOnPress() {
    onChange(!checked);
  }
  const theme = useTheme();
  const opacity = useSharedValue(checked ? 1 : 0);
  const borderColor = useSharedValue(
    checked ? theme.palette.primary.main.get() : Constants.GRAY[theme.palette.mode === 'light' ? 8 : 6].get()
  );
  const backgroundColor = useSharedValue(checked ? theme.palette.primary.main.get() : 'transparent');
  useMountedEffect(() => {
    if (checked) {
      opacity.value = 1;
      borderColor.value = theme.palette.primary.main.get();
      backgroundColor.value = theme.palette.primary.main.get();
    } else {
      opacity.value = 0;
      borderColor.value = Constants.GRAY[theme.palette.mode === 'light' ? 8 : 6].get();
      backgroundColor.value = 'transparent';
    }
  }, [checked]);

  const iconStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const checkboxStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
    backgroundColor: backgroundColor.value,
  }));

  return (
    <ButtonBase onPress={handleOnPress} round>
      <CheckboxContainer>
        <CheckboxBorder style={checkboxStyle}>
          <Animated.View style={iconStyles}>
            <Icon
              bundle='MaterialCommunityIcons'
              name='check-bold'
              size='small'
              color={theme.palette.background.paper}
            />
          </Animated.View>
        </CheckboxBorder>
      </CheckboxContainer>
    </ButtonBase>
  );
};

export default Checkbox;
