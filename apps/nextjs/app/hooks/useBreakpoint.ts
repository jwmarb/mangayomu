import { Breakpoint, useSafeArea } from '@app/context/safearea';
import React from 'react';

export default function useBreakpoint() {
  const breakpointSet = useSafeArea((s) => s.breakpoint);
  const is = React.useCallback(
    (breakpoint: Breakpoint) => {
      return breakpointSet.has(breakpoint);
    },
    [breakpointSet],
  );

  return is;
}
