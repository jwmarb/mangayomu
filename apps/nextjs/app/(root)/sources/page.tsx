'use client';
import Text from '@app/components/Text';
import React from 'react';
import { MangaHost } from '@mangayomu/mangascraper';
import Source from '@app/(root)/sources/components/source';
import TextField from '@app/components/TextField';
import Button from '@app/components/Button';
import { MdSearch, MdFilterList } from 'react-icons/md';
import { useAddedSources } from '@app/context/sources';
import Screen from '@app/components/Screen';

export default function SourceSelector() {
  const [query, setQuery] = React.useState<string>('');
  const sources = useAddedSources((store) => store.sources);
  const set = React.useMemo(() => new Set(sources), [sources]);
  const mapped = React.useMemo(
    () =>
      MangaHost.getListSources()
        .filter((val) => val.toLowerCase().includes(query.toLowerCase()))
        .map((x, i) => (
          <Source key={x + i} source={x} isSelected={set.has(x)} />
        )),
    [query, set],
  );
  return (
    <Screen>
      <Screen.Header className="flex flex-col gap-2">
        <TextField
          onChange={setQuery}
          className="w-full"
          placeholder="Search for a source name..."
          adornment={<MdSearch />}
        />
        <div className="flex flex-row">
          <button className="py-2 px-4 flex-grow border-b-2 border-primary">
            <Text color="primary">All Sources</Text>
          </button>
          <button className="py-2 px-4 flex-grow">
            <Text color="hint">Selected ({sources.length})</Text>
          </button>
        </div>
      </Screen.Header>
      <Screen.Content className="flex flex-col gap-4">
        <div className="flex justify-end items-center">
          <Button icon={<MdFilterList />}>Filters</Button>
        </div>
        {mapped.length > 0 ? (
          <div className="grid xl:grid-cols-3 md:grid-cols-2 gap-2 md:gap-4">
            {mapped}
          </div>
        ) : (
          <div>
            <Text variant="header-emphasized">No results found</Text>
            <Text color="text-secondary">
              There are no sources that match &quot;{query}&quot;
            </Text>
          </div>
        )}
      </Screen.Content>
    </Screen>
  );
}
