'use client';
import Book from '@app/components/Book';
import IconButton from '@app/components/IconButton';
import { ModalMethods } from '@app/components/Modal';
import Screen from '@app/components/Screen';
import Text from '@app/components/Text';
import TextField from '@app/components/TextField';
import {
  SORT_LIBRARY_BY,
  useMangaLibrary,
  useMangaLibraryFilters,
} from '@app/context/library';
import React from 'react';
import { MdFilterAlt } from 'react-icons/md';
import { shallow } from 'zustand/shallow';
import Filter from './components/filter';
import NoMangasInLibrary from '@app/(root)/library/components/nomangasinlibrary';
import { sort } from 'fast-sort';

export default function Page() {
  const [includedSrc, sortBy, reversed] = useMangaLibraryFilters(
    (s) => [s.includeSources, s.sortLibraryBy, s.reversedSort],
    shallow,
  );
  const includedSrcUniq = React.useMemo(
    () => new Set(includedSrc),
    [includedSrc],
  );
  const query = useMangaLibrary((s) => s.query);
  const mangas = useMangaLibrary((s) => s.mangas, shallow);
  const syncStatus = useMangaLibrary((s) => s.syncStatus);
  const filtered = React.useMemo(() => {
    const parsedQuery = query.trim().toLowerCase();
    return mangas.filter(
      (prev) =>
        prev.title.toLowerCase().trim().includes(parsedQuery) &&
        includedSrcUniq.has(prev.source),
    );
  }, [mangas, query, includedSrcUniq]);
  const sorted = React.useMemo(
    () =>
      sort(filtered).by(
        reversed
          ? [{ asc: SORT_LIBRARY_BY[sortBy] }]
          : [{ desc: SORT_LIBRARY_BY[sortBy] }],
      ),
    [filtered, reversed, sortBy],
  );
  const setQuery = useMangaLibrary((s) => s.setQuery);
  const ref = React.useRef<ModalMethods>(null);
  const handleOnOpenModal = () => {
    ref.current?.open();
  };
  return (
    <Screen>
      <Filter ref={ref} />
      <Screen.Header className="pb-2 z-10">
        <div className="max-w-screen-xl mx-auto w-full grid grid-cols-[1fr_min-content] justify-between items-center gap-2">
          <TextField
            onChange={setQuery}
            className="w-full"
            placeholder="Search for a title..."
          />
          <div>
            <IconButton icon={<MdFilterAlt />} onPress={handleOnOpenModal} />
          </div>
        </div>
      </Screen.Header>
      <Screen.Content
        className={
          syncStatus === 'done' && filtered.length > 0
            ? undefined
            : 'flex flex-row flex-wrap justify-center'
        }
      >
        {syncStatus === 'initializing' &&
          new Array(30).fill('').map((x, i) => <Book.Skeleton key={i} />)}
        {syncStatus === 'done' && mangas.length === 0 && <NoMangasInLibrary />}
        {syncStatus === 'done' && filtered.length === 0 && (
          <div className="flex flex-col justify-start w-full">
            <Text variant="header-emphasized">No results found</Text>
            <Text color="text-secondary">
              {query.length > 0
                ? `There are no mangas that match "${query}"`
                : 'No mangas match the filter'}
            </Text>
          </div>
        )}
        {syncStatus === 'done' && filtered.length > 0 && (
          <Book.List list={sorted} />
        )}
      </Screen.Content>
    </Screen>
  );
}
