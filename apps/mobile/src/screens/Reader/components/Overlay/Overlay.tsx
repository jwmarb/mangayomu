import Box, { AnimatedBox } from '@components/Box';
import React from 'react';
import connector, { ConnectedOverlayProps } from './Overlay.redux';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Text from '@components/Text';
import Button from '@components/Button';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const Overlay: React.FC<ConnectedOverlayProps> = (props) => {
  const { opacity, active } = props;

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <AnimatedBox
      style={style}
      height="100%"
      width="100%"
      position="absolute"
      left={0}
      right={0}
      bottom={0}
      top={0}
      justify-content="center"
    >
      <Box align-self="center" background-color="red">
        <Text>Hello World</Text>
        <Button label="Click here" onPress={() => console.log('Clicked')} />
      </Box>
    </AnimatedBox>
  );
};

export default connector(React.memo(Overlay));
