import React from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import PaginationOverlay from '@screens/Welcome/components/PaginationOverlay/PaginationOverlay';
import Onboard from '@screens/Welcome/components/Onboard';

const Welcome: React.FC = () => {
  const scrollPosition = useSharedValue(0);
  const handleOnScroll = React.useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollPosition.value = e.nativeEvent.contentOffset.x;
    },
    [],
  );
  return (
    <>
      <PaginationOverlay scrollPosition={scrollPosition} />
      <Onboard onScroll={handleOnScroll} scrollPosition={scrollPosition} />
    </>
  );
};

export default Welcome;
