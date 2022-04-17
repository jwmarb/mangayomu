import React from 'react';

/**
 * Same as useEffect but does not run when the component has first mounted
 * @param effect A function that is invoked when the dependencies are changed
 * @param deps The dependencies when the effect should be called
 */
export default function useMountedEffect(effect: React.EffectCallback, deps?: React.DependencyList): void {
  const isMounted = React.useRef(false);
  React.useEffect(() => {
    if (isMounted.current) {
      effect();
    } else isMounted.current = true;
  }, deps);
}
