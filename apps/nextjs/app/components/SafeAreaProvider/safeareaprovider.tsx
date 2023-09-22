'use client';
import { useSafeArea } from '@app/context/safearea';
import React from 'react';

export default function SafeAreaProvider(props: React.PropsWithChildren) {
  const setMobile = useSafeArea((s) => s.setMobile);
  const setBreakpoint = useSafeArea((s) => s.setBreakpoint);

  React.useEffect(() => {
    const listener = () => {
      setMobile(window.innerWidth < 1024);
      setBreakpoint(window.innerWidth);
    };
    window.addEventListener('resize', listener);

    return () => {
      window.removeEventListener('resize', listener);
    };
  }, [setMobile, setBreakpoint]);
  return <>{props.children}</>;
}
