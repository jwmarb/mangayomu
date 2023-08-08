'use client';
import { useSafeArea } from '@app/context/safearea';
import { shallow } from 'zustand/shallow';
import React from 'react';
import { useDrawer } from '@app/context/drawer';

export default function SafeArea({ children }: React.PropsWithChildren) {
  const { mobile, drawerWidth, setMobile, headerHeight, setBreakpoint } =
    useSafeArea();
  const drawerActive = useDrawer((store) => store.visible);

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

  return (
    <main
      className={`flex flex-col w-full h-full relative ${
        drawerActive ? '-z-10' : ''
      }`}
      style={mobile ? { marginTop: headerHeight } : { marginLeft: drawerWidth }}
    >
      {children}
    </main>
  );
}
