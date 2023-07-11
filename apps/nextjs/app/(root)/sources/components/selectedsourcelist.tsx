import Source from '@app/(root)/sources/components/source';
import Button from '@app/components/Button';
import Text from '@app/components/Text';
import { useAddedSources } from '@app/context/sources';
import React from 'react';
import { MdFilterList } from 'react-icons/md';
import { GiBookPile } from 'react-icons/gi';

export interface SelectedSourceListProps {
  query: string;
}

export default function SelectedSourceList(props: SelectedSourceListProps) {
  const { query } = props;
  const savedSources = useAddedSources((store) => store.sources);
  const hosts = getSearchResult(query, savedSources);

  if (savedSources.length === 0)
    return (
      <div className="flex flex-grow flex-col items-center justify-center">
        <GiBookPile className="text-primary w-20 h-20" />
        <Text variant="header-emphasized" className="text-center">
          You have no selected sources
        </Text>
        <Text color="text-secondary" className="text-center">
          Sources you add will be shown here. All available sources are shown in
          the <strong>All Sources</strong> tab
        </Text>
      </div>
    );

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
            You have no selected sources that match &quot;{query}&quot;
          </Text>
        </div>
      )}
    </>
  );
}

function getSearchResult(query: string, savedSources: string[]) {
  return savedSources
    .filter((val) => val.toLowerCase().includes(query.toLowerCase()))
    .map((x, i) => <Source key={x + i} source={x} isSelected />);
}
