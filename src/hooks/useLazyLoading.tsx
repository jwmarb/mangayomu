import Flex from '@components/Flex';
import Progress from '@components/Progress';
import React from 'react';
import { InteractionManager } from 'react-native';

const Fallback = (
  <Flex grow justifyContent='center' alignItems='center'>
    <Progress />
  </Flex>
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
