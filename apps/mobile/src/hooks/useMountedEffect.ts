import React from 'react';

/**
 * Same as React.useEffect(), but the callback function is not invoked after the component has been mounted.
 */
export default function useMountedEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList,
) {
  const isMounted = React.useRef<boolean>(false);
  React.useEffect(() => {
    if (isMounted.current) {
      effect();
    } else isMounted.current = true;
  }, deps);
}
