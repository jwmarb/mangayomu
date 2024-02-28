import React from 'react';

/**
 * Same as useEffect except it will only run once after mounting.
 * @param callback Callback function
 * @param deps Dependencies to rerun this
 */
export default function useMountEffect(
  callback: React.EffectCallback,
  deps?: React.DependencyList,
) {
  const isMounted = React.useRef(false);
  React.useEffect(() => {
    if (!isMounted.current) {
      callback();
    } else isMounted.current = true;
  }, deps);
}
