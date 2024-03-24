import React from 'react';
import { InteractionManager } from 'react-native';
import useBoolean from '@/hooks/useBoolean';

/**
 * Determines when to load based on interactions
 * @returns Returns a boolean indicating whether interactions have finished
 */
export default function useLoadAfterInteractions() {
  const [ready, toggle] = useBoolean();

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      toggle(true);
    });
  }, []);

  return ready;
}
