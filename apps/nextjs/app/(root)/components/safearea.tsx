'use client';
import { useSafeArea } from '@app/context/safearea';
import { shallow } from 'zustand/shallow';
import React from 'react';

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
    <div className={`flex ${mobile ? 'flex-col' : 'flex-row'}`}>
      <div style={mobile ? { height: headerHeight } : { width: drawerWidth }} />
      {children}
    </div>
  );
}
