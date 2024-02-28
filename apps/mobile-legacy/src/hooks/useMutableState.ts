import React from 'react';

export default function useMutableState<T>(state?: T) {
  const mut = React.useRef<T | undefined>(state);
  const setMut = React.useCallback((val: T) => {
    mut.current = val;
  }, []);

  return [mut, setMut] as const;
}
