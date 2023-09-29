'use client';

import Navbar from '@app/(root)/components/navbar';
import SafeArea from '@app/(root)/components/safearea';
import { useParams, usePathname } from 'next/navigation';

export default function RouteWrapper(
  props: React.PropsWithChildren<{ paper?: boolean }>,
) {
  const { children, paper } = props;
  const params = useParams();

  if ('chapter' in params) return <body>{children}</body>;

  return (
    <body className={`${paper ? 'bg-paper' : 'bg-default'} flex`}>
      {children}
    </body>
  );
}
