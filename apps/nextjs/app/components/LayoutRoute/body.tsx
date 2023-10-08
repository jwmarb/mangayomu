'use client';
import { useReaderSettings } from '@app/context/readersettings';
import { useParams } from 'next/navigation';

export default function RouteBody(
  props: React.PropsWithChildren<{ paper?: boolean }>,
) {
  const { children, paper } = props;
  const params = useParams();
  const backgroundColor = useReaderSettings((state) => state.backgroundColor);

  if ('chapter' in params)
    return <body className={backgroundColor}>{children}</body>;

  return (
    <body className={`${paper ? 'bg-paper' : 'bg-default'} flex`}>
      {children}
    </body>
  );
}
