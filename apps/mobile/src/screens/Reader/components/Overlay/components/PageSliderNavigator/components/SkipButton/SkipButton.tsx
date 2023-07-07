import React from 'react';
import { SkipButtonProps } from './SkipButton.interfaces';
import Box from '@components/Box';
import { moderateScale } from 'react-native-size-matters';
import { OVERLAY_COLOR, OVERLAY_SLIDER_HEIGHT } from '@theme/constants';
import Icon from '@components/Icon';
import { useTheme } from '@emotion/react';
import { Pressable } from 'react-native';

const SkipButton: React.FC<SkipButtonProps> = (props) => {
  const { onSkip } = props;
  const theme = useTheme();
  return (
    <Box align-self="flex-start" border-radius={10000}>
      <Pressable
        android_ripple={{
          color: theme.palette.action.ripple,
          borderless: true,
          foreground: true,
          radius: OVERLAY_SLIDER_HEIGHT / 2,
        }}
        onPress={onSkip}
      >
        <Box
          width={OVERLAY_SLIDER_HEIGHT}
          height={OVERLAY_SLIDER_HEIGHT}
          border-radius={10000}
          background-color={OVERLAY_COLOR}
          align-items="center"
          justify-content="center"
        >
          {'previous' in props && (
            <Icon type="font" name="skip-previous" size={moderateScale(24)} />
          )}
          {'next' in props && (
            <Icon type="font" name="skip-next" size={moderateScale(24)} />
          )}
        </Box>
      </Pressable>
    </Box>
  );
};

export default React.memo(SkipButton);
