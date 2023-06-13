import React from 'react';
import { OverlayFooterProps } from './OverlayFooter.interfaces';
import { AnimatedBox } from '@components/Box';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OVERLAY_COLOR } from '@theme/constants';
import ImageScaling from '@screens/Reader/components/Overlay/components/ImageScaling';
import ZoomStartPosition from '@screens/Reader/components/Overlay/components/ZoomStartPosition';
import DeviceOrientation from '@screens/Reader/components/Overlay/components/DeviceOrientation';
import ReaderDirection from '@screens/Reader/components/Overlay/components/ReaderDirection';

import Stack from '@components/Stack';

const OverlayFooter: React.FC<OverlayFooterProps> = (props) => {
  const { style } = props;
  const insets = useSafeAreaInsets();

  return (
    <AnimatedBox
      px="m"
      pb={insets.bottom}
      background-color={OVERLAY_COLOR}
      style={style}
    >
      <Stack flex-direction="row" space="s" justify-content="space-evenly">
        <DeviceOrientation />
        <ZoomStartPosition />
        <ImageScaling />
        <ReaderDirection />
      </Stack>
    </AnimatedBox>
  );
};

export default React.memo(OverlayFooter);
