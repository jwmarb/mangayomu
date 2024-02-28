import React from 'react';
import { RootStackProps } from '@navigators/Root/Root.interfaces';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
const BasicMangaList = React.lazy(() => import('./BasicMangaList'));
export default function (props: RootStackProps<'BasicMangaList'>) {
  const title =
    props.route.params.stateKey === 'latest'
      ? 'Recently updated'
      : 'Trending updates';
  const collapsible = useCollapsibleHeader({ headerTitle: title });
  return (
    <React.Suspense>
      <BasicMangaList {...collapsible} {...props} />
    </React.Suspense>
  );
}
