import React from 'react';

/**
 * Indicate whether or not the component is mounted. This will not cause any rerenders and should be used for logic code
 * @returns Returns whether or not the component is mounted
 */
export default function useIsMounted() {
  const isMountedRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    isMountedRef.current = true;
  }, []);

  return (() => isMountedRef.current)(); // prevent rerender
}
