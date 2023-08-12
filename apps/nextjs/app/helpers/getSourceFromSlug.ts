import React from 'react';
import { MangaHost } from '@mangayomu/mangascraper';
import getSlug from '@app/helpers/getSlug';

const getSourceFromSlug = React.cache((sourceSlug: string) => {
  const idx = MangaHost.sources.findIndex(
    (source) => getSlug(source) === sourceSlug,
  );
  return MangaHost.sourcesMap.get(MangaHost.sources[idx]);
});

export default getSourceFromSlug;
