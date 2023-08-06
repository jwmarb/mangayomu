// export { default } from './Explore';

// import Box from '@components/Box';
// import Progress from '@components/Progress';
import Avatar from '@components/Avatar';
import Badge from '@components/Badge';
import Box from '@components/Box';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import LazyFallback from '@components/LazyFallback';
import Progress from '@components/Progress';
import getMangaHost, { equalityMangaHostFn } from '@helpers/getMangaHost';
import useAppSelector from '@hooks/useAppSelector';
import useCollapsibleTabHeader from '@hooks/useCollapsibleTabHeader';
import { useUser } from '@realm/react';
import React from 'react';
const LazyExplore = React.lazy(() => import('./Explore'));

export type ExploreMethods = {
  openMainSourceSelector: () => void;
};

export interface ExploreProps
  extends ReturnType<typeof useCollapsibleTabHeader> {
  source: ReturnType<typeof getMangaHost>;
  loading: boolean;
}

export default function ExploreBase() {
  const user = useUser();
  const source = useAppSelector<ReturnType<typeof getMangaHost>>(
    (state) => getMangaHost(state),
    equalityMangaHostFn,
  );
  const loading = useAppSelector(
    (state) =>
      (state.explore.status.hot === 'loading' ||
        state.explore.status.latest === 'loading') &&
      state.explore.internetStatus === 'online',
  );
  const ref = React.useRef<ExploreMethods>(null);

  const props = useCollapsibleTabHeader({
    dependencies: [source.getSourcesLength(), user?.profile.pictureUrl],
    loading,
    headerLeft: (
      <Badge type="number" count={source.getSourcesLength()} color="primary">
        <IconButton
          icon={<Icon type="font" name="bookshelf" />}
          onPress={ref.current?.openMainSourceSelector}
        />
      </Badge>
    ),
    headerRight: (
      <IconButton icon={<Avatar />} onPress={() => console.log('Account')} />
    ),
  });
  return (
    <React.Suspense fallback={LazyFallback}>
      <LazyExplore ref={ref} {...props} source={source} loading={loading} />
    </React.Suspense>
  );
}
