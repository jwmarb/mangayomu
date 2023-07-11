'use client';
import Source from '@app/(root)/sources/components/source';
import Button from '@app/components/Button';
import Tabs from '@app/components/Tabs';
import Text from '@app/components/Text';
import { useAddedSources } from '@app/context/sources';
import { MangaHost } from '@mangayomu/mangascraper';
import React from 'react';
import { MdFilterList } from 'react-icons/md';

interface SourcelistProps {
  query: string;
}

export default function SourceList(props: SourcelistProps) {
  const { query } = props;
  const savedSources = useAddedSources((store) => store.sources);
  const sourcesSet = React.useMemo(() => new Set(savedSources), [savedSources]);
  const hosts = getSearchResult(query, sourcesSet);
  return (
    <>
      <div className="flex justify-end items-center">
        <Button icon={<MdFilterList />}>Filters</Button>
      </div>
      {hosts.length > 0 ? (
        <div className="grid xl:grid-cols-3 md:grid-cols-2 gap-2 md:gap-4">
          {hosts}
        </div>
      ) : (
        <div>
          <Text variant="header-emphasized">No results found</Text>
          <Text color="text-secondary">
            There are no sources that match &quot;{query}&quot;
          </Text>
        </div>
      )}
    </>
  );
}

function getSearchResult(query: string, sources: Set<string>) {
  return MangaHost.sources
    .filter((val) => val.toLowerCase().includes(query.toLowerCase()))
    .map((x, i) => (
      <Source key={x + i} source={x} isSelected={sources.has(x)} />
    ));
}
