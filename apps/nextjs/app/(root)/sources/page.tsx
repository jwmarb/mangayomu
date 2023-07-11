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
import Tabs from '@app/components/Tabs';
import SourceList from '@app/(root)/sources/components/sourcelist';
import SelectedSourceList from '@app/(root)/sources/components/selectedsourcelist';

export default function SourceSelector() {
  const [query, setQuery] = React.useState<string>('');
  const savedSources = useAddedSources((store) => store.sources);

  return (
    <Screen>
      <Tabs>
        <Screen.Header className="flex flex-col gap-2">
          <TextField
            onChange={setQuery}
            className="w-full"
            placeholder="Search for a source name..."
            adornment={<MdSearch />}
          />
          <Tabs.List>
            <Tabs.Tab>All Sources</Tabs.Tab>
            <Tabs.Tab>Selected ({savedSources.length})</Tabs.Tab>
          </Tabs.List>
        </Screen.Header>
        <Screen.Content className="flex flex-grow flex-col gap-4">
          <Tabs.Panel>
            <SourceList query={query} />
          </Tabs.Panel>
          <Tabs.Panel>
            <SelectedSourceList query={query} />
          </Tabs.Panel>
        </Screen.Content>
      </Tabs>
    </Screen>
  );
}
