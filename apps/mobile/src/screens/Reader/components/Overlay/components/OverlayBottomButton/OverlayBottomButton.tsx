import React from 'react';
import { OverlayBottomButtonProps } from './OverlayBottomButton.interfaces';
import Box from '@components/Box';
import Icon from '@components/Icon';
import { moderateScale } from 'react-native-size-matters';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useTheme } from '@emotion/react';
import { OVERLAY_TEXT_PRIMARY } from '@theme/constants';
import displayMessage from '@helpers/displayMessage';

const OverlayBottomButton: React.FC<OverlayBottomButtonProps> = (props) => {
  const { name, settingName, ...rest } = props;
  const theme = useTheme();
  function handleOnLongPress() {
    displayMessage(settingName);
  }
  return (
    <BorderlessButton
      rippleColor={theme.palette.action.ripple}
      {...rest}
      onLongPress={handleOnLongPress}
      disallowInterruption
      cancelsTouchesInView
    >
      <Box py={theme.style.spacing.m} flex-grow align-items="center">
        <Icon
          type="font"
          name={name}
          size={moderateScale(24)}
          color={OVERLAY_TEXT_PRIMARY}
        />
      </Box>
    </BorderlessButton>
  );
};

export default OverlayBottomButton;
