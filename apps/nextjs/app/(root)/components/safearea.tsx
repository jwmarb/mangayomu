'use client';
import { useSafeArea } from '@app/context/safearea';
import { shallow } from 'zustand/shallow';
import React from 'react';
import { useDrawer } from '@app/context/drawer';

export default function SafeArea({ children }: React.PropsWithChildren) {
  const { mobile, drawerWidth, setMobile, headerHeight } = useSafeArea(
    (store) => ({
      mobile: store.mobile,
      drawerWidth: store.drawerWidth,
      setMobile: store.setMobile,
      headerHeight: store.headerHeight,
    }),
    shallow,
  );
  const drawerActive = useDrawer((store) => store.visible);

  React.useEffect(() => {
    const listener = () => {
      setMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', listener);

    return () => {
      window.removeEventListener('resize', listener);
    };
  }, [setMobile]);

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
