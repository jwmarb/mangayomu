import { Accordion } from '@app/components/Accordion';
import Button from '@app/components/Button';
import Modal, { ModalMethods } from '@app/components/Modal';
import Tabs from '@app/components/Tabs';
import Text from '@app/components/Text';
import Filter from '@app/components/Filter';
import React from 'react';
import {
  SORT_LIBRARY_BY_KEYS,
  useMangaLibrary,
  useMangaLibraryFilters,
} from '@app/context/library';
import { shallow } from 'zustand/shallow';

function LibraryFilter(
  props: React.PropsWithChildren,
  ref: React.ForwardedRef<ModalMethods>,
) {
  const mangas = useMangaLibrary((s) => s.mangas);
  const [sources, setSources, reset, sortBy, setSortBy, reversed] =
    useMangaLibraryFilters(
      (s) => [
        s.includeSources,
        s.setIncludeSources,
        s.resetFilters,
        s.sortLibraryBy,
        s.setSortBy,
        s.reversedSort,
      ],
      shallow,
    );
  const numberInLibrary = React.useMemo(
    () =>
      Object.entries(
        mangas.reduce((prev, curr) => {
          if (prev[curr.source] == null) prev[curr.source] = 0;
          prev[curr.source] += 1;
          return prev;
        }, {} as Record<string, number>),
      ),
    [mangas],
  );
  return (
    <Modal ref={ref} className="h-96">
      <Tabs>
        <Tabs.List>
          <Tabs.Tab>Filter</Tabs.Tab>
          <Tabs.Tab>Sort</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel>
          <div className="flex flex-col p-4">
            <Button onPress={reset} className="w-full">
              Reset Filters
            </Button>
          </div>
          <Accordion title="Sources" defaultOpened>
            <Filter type="checkbox" selected={sources} onChange={setSources}>
              {numberInLibrary.map(([source, count]) => (
                <Filter.Checkbox
                  key={source}
                  value={source}
                  text={source}
                  subtitle={`(${count})`}
                />
              ))}
            </Filter>
          </Accordion>
        </Tabs.Panel>
        <Tabs.Panel>
          <Filter
            type="sort"
            selected={sortBy}
            reversed={reversed}
            onChange={setSortBy}
          >
            {SORT_LIBRARY_BY_KEYS.map((x) => (
              <Filter.Sort value={x} key={x} />
            ))}
          </Filter>
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
}

export default React.forwardRef(LibraryFilter);
