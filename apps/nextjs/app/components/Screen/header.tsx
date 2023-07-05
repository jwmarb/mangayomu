'use client';
import { useSafeArea } from '@app/context/safearea';
import { shallow } from 'zustand/shallow';
import React from 'react';
import { useSetHeaderHeight } from './screen';
import useClassName from '@app/hooks/useClassName';

interface HeaderProps
  extends React.PropsWithChildren,
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    > {
  deps?: React.DependencyList;
}

export default function Header(props: HeaderProps) {
  const { children, deps = [], ...rest } = props;
  const className = useClassName(
    'fixed right-0 px-4 bg-paper bg-default lg:pt-2',
    props,
  );
  const setHeaderHeight = useSetHeaderHeight();
  const [mobile, drawerWidth] = useSafeArea(
    (store) => [store.mobile, store.drawerWidth],
    shallow,
  );
  const headerRef = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    if (headerRef.current?.offsetHeight)
      setHeaderHeight(headerRef.current.offsetHeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return (
    <div
      {...rest}
      ref={headerRef}
      className={className}
      style={{ left: mobile ? 0 : drawerWidth }}
    >
      {children}
    </div>
  );
}
