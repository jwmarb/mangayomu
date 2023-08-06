import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import React from 'react';
// import { register } from 'react-native-bundle-splitter';
// export default register({ loader: () => import('./Appearance') });
const LazyAppearance = React.lazy(() => import('./Appearance'));
export default function Appearance() {
  const props = useCollapsibleHeader({ headerTitle: 'Appearance' });
  return (
    <React.Suspense>
      <LazyAppearance {...props} />
    </React.Suspense>
  );
}
