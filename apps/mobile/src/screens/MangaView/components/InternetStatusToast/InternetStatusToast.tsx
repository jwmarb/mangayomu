import React from 'react';
import { InternetStatusToastProps } from './InternetStatusToast.interfaces';
import {
  FadeInDown,
  FadeOutDown,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import connector, {
  ConnectedInternetStatusProps,
} from './InternetStatus.redux';
import { AnimatedBox } from '@components/Box';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@emotion/react';
import Text from '@components/Text';
import { LayoutChangeEvent } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

const InternetStatusToast: React.FC<ConnectedInternetStatusProps> = (props) => {
  const { manga, internetStatus, networkStatusOffset } = props;
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const handleOnNetworkErrorLayout = (layout: LayoutChangeEvent) => {
    networkStatusOffset.value = withTiming(
      layout.nativeEvent.layout.height + theme.style.spacing.s,
      { duration: 50 },
    );
  };
  React.useEffect(() => {
    if (internetStatus === 'online')
      networkStatusOffset.value = moderateScale(32);
  }, [internetStatus]);

  if (manga != null && internetStatus === 'offline')
    return (
      <AnimatedBox
        exiting={FadeOutDown}
        entering={FadeInDown}
        onLayout={handleOnNetworkErrorLayout}
        px="s"
        pt="s"
        pb={insets.bottom + theme.style.spacing.s}
        background-color="primary"
        position="absolute"
        bottom={0}
        left={0}
        right={0}
      >
        <Text bold align="center">
          You are viewing a local version of the manga
        </Text>
      </AnimatedBox>
    );
  return null;
};

export default connector(React.memo(InternetStatusToast));
