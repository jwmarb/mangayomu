import { FloatingModalBaseContainer, FloatingModalContainer } from '@components/FloatingModal/FloatingModal.base';
import { Typography } from '@components/Typography';
import { Portal } from '@gorhom/portal';
import React from 'react';
import {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { FloatingModalProps } from './FloatingModal.interfaces';

const FloatingModal: React.FC<FloatingModalProps> = (props) => {
  const { visible, children } = props;
  const bottom = useSharedValue(0);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      opacity.value = withSpring(1);
      bottom.value = withTiming(50, { duration: 300, easing: Easing.linear });
    } else {
      opacity.value = withSpring(0);
      bottom.value = withTiming(-100, { duration: 200, easing: Easing.ease });
    }
    // return () => {
    //   cancelAnimation(opacity);
    //   cancelAnimation(bottom);
    // }
  }, [visible]);
  const baseStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const containerStyles = useAnimatedStyle(() => ({
    bottom: bottom.value,
  }));

  return (
    <Portal>
      <FloatingModalBaseContainer style={baseStyles}>
        <FloatingModalContainer style={containerStyles}>{children}</FloatingModalContainer>
      </FloatingModalBaseContainer>
    </Portal>
  );
};

export default FloatingModal;
