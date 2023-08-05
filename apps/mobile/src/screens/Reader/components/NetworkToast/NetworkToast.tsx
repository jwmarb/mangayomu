import Box, { AnimatedBox } from '@components/Box/Box';
import Icon from '@components/Icon/Icon';
import Stack from '@components/Stack/Stack';
import Text from '@components/Text/Text';
import { Portal } from '@gorhom/portal';
import { READER_NETWORK_TOAST_HEIGHT } from '@theme/constants';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import { NetworkToastProps } from './';
import useAppSelector from '@hooks/useAppSelector';

const NetworkToast: React.FC<NetworkToastProps> = ({ style }) => {
  const internetStatus = useAppSelector(
    (state) => state.explore.internetStatus,
  );
  const insets = useSafeAreaInsets();
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
      {/* <Box
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
        <Button
          onPress={() => {
            console.log(fetchedChapters);
          }}
          label="Print fetchedChapters"
          variant="contained"
          color="primary"
        />
        <Button
          onPress={() => {
            console.log(fetchingChapters);
          }}
          label="Print fetchingChapters"
          variant="contained"
          color="primary"
        />
      </Box> */}
    </Portal>
  );
};

export default React.memo(NetworkToast);
