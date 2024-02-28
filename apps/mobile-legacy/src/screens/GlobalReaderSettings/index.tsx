import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import React from 'react';
// import { register } from 'react-native-bundle-splitter';
// export default register({ loader: () => import('./Settings') });
const LazyGlobalReaderSettings = React.lazy(
  () => import('./GlobalReaderSettings'),
);

export default function Settings() {
  const props = useCollapsibleHeader({ headerTitle: 'Reader' });

  return (
    <React.Suspense>
      <LazyGlobalReaderSettings {...props} />
    </React.Suspense>
  );
}
