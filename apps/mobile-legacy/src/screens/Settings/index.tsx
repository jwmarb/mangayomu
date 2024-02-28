import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import React from 'react';
// import { register } from 'react-native-bundle-splitter';
// export default register({ loader: () => import('./Settings') });
const LazySettings = React.lazy(() => import('./Settings'));

export default function Settings() {
  const props = useCollapsibleHeader({ headerTitle: 'Settings' });

  return (
    <React.Suspense>
      <LazySettings {...props} />
    </React.Suspense>
  );
}
