import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import React from 'react';

const LazyPerformance = React.lazy(() => import('./Performance'));

export default function Performance() {
  const props = useCollapsibleHeader({ headerTitle: 'Performance' });
  return (
    <React.Suspense>
      <LazyPerformance {...props} />
    </React.Suspense>
  );
}
