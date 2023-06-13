import React from 'react';
import { OverlayBottomButtonProps } from './OverlayBottomButton.interfaces';
import Box from '@components/Box';
import Icon from '@components/Icon';
import { moderateScale } from 'react-native-size-matters';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useTheme } from '@emotion/react';
import { OVERLAY_TEXT_PRIMARY } from '@theme/constants';

const OverlayBottomButton: React.FC<OverlayBottomButtonProps> = (props) => {
  const { name, ...rest } = props;
  const theme = useTheme();
  return (
    <BorderlessButton rippleColor={theme.palette.action.ripple} {...rest}>
      <Box px="m" py={theme.style.spacing.l} flex-grow align-items="center">
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
