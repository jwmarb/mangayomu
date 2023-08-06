import Box from '@components/Box';
import Progress from '@components/Progress';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import React from 'react';
const LazyUnfinishedMangaList = React.lazy(
  () => import('./UnfinishedMangaList'),
);
// import { register } from 'react-native-bundle-splitter';
// export default register({ loader: () => import('./UnfinishedMangaList') });

export default function UnfinishedMangaList() {
  const props = useCollapsibleHeader({
    headerTitle: '',
  });

  // return (
  //   <Box
  //     width="100%"
  //     height="100%"
  //     justify-content="center"
  //     align-items="center"
  //     flex-grow
  //   >
  //     <Progress />
  //   </Box>
  // );
  return (
    <React.Suspense fallback={Fallback}>
      <LazyUnfinishedMangaList {...props} />
    </React.Suspense>
  );
}

const Fallback = (
  <Box
    width="100%"
    height="100%"
    justify-content="center"
    align-items="center"
    flex-grow
  >
    <Progress />
  </Box>
);
