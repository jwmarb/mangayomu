import { Screen } from '@components/core';
import useSearchBar from '@hooks/useSearchBar';
import useStatefulHeader from '@hooks/useStatefulHeader';
import MangaHostSearch from '@screens/Home/screens/Browse/components/MangaHostSearch';
import MangaHost from '@services/scraper/scraper.abstract';
import React from 'react';

const Browse: React.FC = (props) => {
  const {} = props;
  const { query, header } = useSearchBar({ event: 'onSubmitEditing', title: 'Browse' });
  const [mangaHosts, setMangaHosts] = React.useState<MangaHost[]>(Array.from(MangaHost.availableSources.values()));
  useStatefulHeader(header);

  return (
    <Screen scrollable>
      {mangaHosts.map((x) => (
        <MangaHostSearch key={x.getLink()} host={x} query={query} />
      ))}
    </Screen>
  );
};

export default Browse;
