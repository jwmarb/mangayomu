'use client';
import { useHeaderHeight } from '@app/components/Screen/screen';
import { useSafeArea } from '@app/context/safearea';
import useClassName, { OverrideClassName } from '@app/hooks/useClassName';
import React from 'react';

interface ContentProps
  extends React.PropsWithChildren,
    OverrideClassName,
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    > {}

export default function Content(props: ContentProps) {
  const {
    children,
    className: defaultClassName,
    overrideClassName,
    style = {},
    ...rest
  } = props;
  const headerHeight = useHeaderHeight();
  const navHeaderHeight = useSafeArea((store) => store.headerHeight);
  const isMobile = useSafeArea((store) => store.mobile);
  const className = useClassName('max-w-screen-xl mx-auto p-4', {
    className: defaultClassName,
    overrideClassName,
  });

  return (
    <div
      {...rest}
      className={className}
      style={{
        marginTop: headerHeight,
        minHeight:
          headerHeight != null
            ? window.innerHeight -
              headerHeight -
              (!isMobile ? 0 : navHeaderHeight)
            : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
