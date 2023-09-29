'use client';
import { useParams } from 'next/navigation';

export default function RouteBody(
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
