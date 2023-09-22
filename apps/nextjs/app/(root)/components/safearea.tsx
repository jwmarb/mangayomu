'use client';
import { useSafeArea } from '@app/context/safearea';
import React from 'react';
import { useDrawer } from '@app/context/drawer';

export default function SafeArea({ children }: React.PropsWithChildren) {
  const mobile = useSafeArea((s) => s.mobile);
  const drawerWidth = useSafeArea((s) => s.drawerWidth);
  const headerHeight = useSafeArea((s) => s.headerHeight);
  const drawerActive = useDrawer((store) => store.visible);

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
