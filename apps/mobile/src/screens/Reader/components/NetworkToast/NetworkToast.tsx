import Box, { AnimatedBox } from '@components/Box/Box';
import Button from '@components/Button/Button';
import Icon from '@components/Icon/Icon';
import Stack, { AnimatedStack } from '@components/Stack/Stack';
import Text from '@components/Text/Text';
import { useTheme } from '@emotion/react';
import { Portal } from '@gorhom/portal';
import useBoolean from '@hooks/useBoolean';
import { READER_NETWORK_TOAST_HEIGHT } from '@theme/constants';
import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import connector, { ConnectedNetworkToastProps } from './NetworkToast.redux';
import useMountedEffect from '@hooks/useMountedEffect';

const NetworkToast: React.FC<ConnectedNetworkToastProps> = ({
  internetStatus,
  setNetworkState,
}) => {
  const insets = useSafeAreaInsets();
  const derivedValue = useSharedValue(0);
  const opacity = useSharedValue(0);
  const theme = useTheme();
  const translateY = useDerivedValue(() =>
    interpolate(
      opacity.value,
      [0, 1],
      [-(insets.top + READER_NETWORK_TOAST_HEIGHT), 0],
    ),
  );
  const backgroundColor = useDerivedValue(() =>
    interpolateColor(
      derivedValue.value,
      [1, 0],
      [theme.palette.background.default, theme.palette.primary.main],
    ),
  );
  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
    backgroundColor: backgroundColor.value,
  }));

  useMountedEffect(() => {
    if (internetStatus === 'online') {
      derivedValue.value = withTiming(0, {
        duration: 150,
        easing: Easing.ease,
      });
      opacity.value = withDelay(
        2000,
        withTiming(0, { duration: 150, easing: Easing.ease }),
      );
    } else {
      derivedValue.value = 1;
      opacity.value = withTiming(1, { duration: 150, easing: Easing.ease });
    }
  }, [internetStatus]);

  return (
    <Portal>
      <Box style={StyleSheet.absoluteFill} pointerEvents="none">
        <AnimatedBox
          style={style}
          align-items="flex-end"
          flex-direction="row"
          justify-content="center"
          height={insets.top + READER_NETWORK_TOAST_HEIGHT}
        >
          <Stack
            space="s"
            flex-direction="row"
            align-items="center"
            align-self="flex-end"
            justify-content="center"
            pb={moderateScale(4)}
          >
            {internetStatus === 'online' ? (
              <>
                <Icon type="font" name="web" />
                <Text>Internet available</Text>
              </>
            ) : (
              <>
                <Icon
                  type="font"
                  name="cloud-off-outline"
                  color="textSecondary"
                />
                <Text color="textSecondary">No internet connection</Text>
              </>
            )}
          </Stack>
        </AnimatedBox>
      </Box>
      <Box
        style={StyleSheet.absoluteFill}
        pointerEvents="box-none"
        justify-content="center"
        align-items="center"
      >
        <Button
          onPress={() => {
            if (internetStatus === 'offline') setNetworkState('online');
            else setNetworkState('offline');
          }}
          label="Toggle Network State"
          variant="contained"
          color="primary"
        />
      </Box>
    </Portal>
  );
};

export default connector(React.memo(NetworkToast));
