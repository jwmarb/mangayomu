import Flex from '@components/Flex';
import Progress from '@components/Progress';
import React from 'react';
import { InteractionManager } from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import styled, { css } from 'styled-components/native';

const Container = styled(Animated.View).attrs({ entering: FadeInUp, exiting: FadeOutDown })`
  flex-grow: 1;
  justify-content: center;
  align-items: center;
`;

const Fallback = (
  <Container>
    <Progress />
  </Container>
);

/**
 * Lazy load a component if it is extremely laggy to mount
 */
export default function useLazyLoading() {
  const [ready, setReady] = React.useState<boolean>(false);

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setReady(true);
    });
  }, []);

  return { Fallback, ready };
}
