import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import { RootStackProps } from '@navigators/Root/Root.interfaces';
import React from 'react';
// import { register } from 'react-native-bundle-splitter';
// export default register({ loader: () => import('./SourceView') });
const LazySourceView = React.lazy(() => import('./SourceView'));

export default function SourceView(props: RootStackProps<'SourceView'>) {
  const collapsible = useCollapsibleHeader({ headerTitle: 'Source Info' });
  return (
    <React.Suspense>
      <LazySourceView {...props} {...collapsible} />
    </React.Suspense>
  );
}
