'use client';
import { useUser } from '@app/context/realm';
import getErrorMessage from '@app/helpers/getErrorMessage';
import useMongoClient from '@app/hooks/useMongoClient';
import MangaSchema from '@app/realm/Manga';
import React from 'react';
import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { integrateSortedList } from '@mangayomu/algorithms';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { IMangaSchema } from '@mangayomu/schemas';
import SourceMangaSchema from '@app/realm/SourceManga';
import getMangaHost from '@app/helpers/getMangaHost';
import { getSourceMangaId } from '@mangayomu/backend';

export const SORT_LIBRARY_BY = {
  'Age in library': (a: IMangaSchema) => a.dateAddedInLibrary,
  'Number of updates': (a: IMangaSchema) => a.notifyNewChaptersCount,
  Title: (a: IMangaSchema) => a.title,
  Source: (a: IMangaSchema) => a.source,
};

export const SORT_LIBRARY_BY_KEYS = Object.keys(
  SORT_LIBRARY_BY,
) as SortLibraryBy[];

const idComparator = (a: IMangaSchema, b: IMangaSchema) =>
  a._id.toHexString().localeCompare(b._id.toHexString());

export type SortLibraryBy = keyof typeof SORT_LIBRARY_BY;

interface MangaLibraryFilter {
  includeSources: string[];
  defaultSources: string[];
  sortLibraryBy: SortLibraryBy;
  reversedSort: boolean;
  setIncludeSources: (
    val: IMangaSchema[] | string[],
    initializeDefault?: boolean,
  ) => void;
  setDefaultSources: (val: IMangaSchema[]) => void;
  resetFilters: () => void;
  setSortBy: (v: SortLibraryBy, reversed: boolean) => void;
}

interface MangaLibraryStore {
  error?: string;
  syncStatus: 'initializing' | 'done' | 'syncing' | 'error';

  query: string;
  mangas: IMangaSchema[];
  setMangas: (s: IMangaSchema[]) => void;
  deleteManga: (id: Realm.BSON.ObjectId) => void;
  addManga: (manga: IMangaSchema) => void;
  updateManga: <TOptions extends { upsert?: boolean }>(
    _id: Realm.BSON.ObjectId,
    fields: TOptions['upsert'] extends true
      ? IMangaSchema
      : Partial<IMangaSchema>,
    options?: TOptions,
  ) => void;
  setError: (s: unknown) => void;
  resetSyncState: () => void;
  setQuery: (v: string) => void;
}

export const useMangaLibraryFilters = create(
  persist(
    immer<MangaLibraryFilter>((set) => ({
      includeSources: [],
      defaultSources: [],
      sortLibraryBy: 'Age in library',

      reversedSort: false,
      setIncludeSources: (val, initializeDefault) => {
        set((state) => {
          const uniq = new Set<string>();
          state.includeSources = [];
          if (initializeDefault) state.defaultSources = [];

          for (const value of val) {
            if (typeof value === 'string') {
              state.includeSources.push(value);
            } else if (!uniq.has(value.source)) {
              uniq.add(value.source);
              state.includeSources.push(value.source);
              if (initializeDefault) state.defaultSources.push(value.source);
            }
          }
        });
      },
      setDefaultSources: (val) => {
        set((state) => {
          const uniq = new Set<string>();
          state.defaultSources = [];
          for (const value of val) {
            if (!uniq.has(value.source)) {
              uniq.add(value.source);
              state.includeSources.push(value.source);
            }
          }
        });
      },
      resetFilters: () => {
        set((state) => {
          state.includeSources = state.defaultSources;
        });
      },
      setSortBy: (v, reversed) =>
        set({ sortLibraryBy: v, reversedSort: reversed }),
    })),
    { name: 'library_filters' },
  ),
);

export const useMangaLibrary = create(
  immer<MangaLibraryStore>((set) => ({
    syncStatus: 'initializing',
    query: '',
    mangas: [],
    setMangas: (v) => set({ mangas: v, syncStatus: 'done' }),
    setError: (v) => set({ error: getErrorMessage(v), syncStatus: 'error' }),
    resetSyncState: () => set({ syncStatus: 'initializing', mangas: [] }),
    deleteManga: (_id) => {
      set((state) => {
        const p = integrateSortedList(state.mangas, idComparator);
        p.remove({ _id });
      });
    },
    addManga: (m) => {
      set((state) => {
        const p = integrateSortedList(state.mangas, idComparator);
        p.add(m);
      });
    },
    updateManga: function <
      TOptions extends { upsert?: boolean } = { upsert: false },
    >(
      _id: Realm.BSON.ObjectId,
      fields: TOptions['upsert'] extends true
        ? IMangaSchema
        : Partial<IMangaSchema>,
      options: TOptions = { upsert: false } as TOptions,
    ) {
      const { upsert } = options;
      set((state) => {
        const p = integrateSortedList(state.mangas, idComparator);
        const idx = p.indexOf({ _id });
        if (upsert && idx === -1) {
          p.add(fields as IMangaSchema);
        } else
          for (const k in fields) {
            const key = k as keyof typeof fields;
            (state.mangas[idx][key as keyof IMangaSchema] as any) = fields[key];
          }
      });
    },
    setQuery: (v) => set({ query: v }),
  })),
);

export default function MangaLibraryInitializer(
  props: React.PropsWithChildren,
) {
  const [
    setMangas,
    resetSyncState,
    setError,
    deleteManga,
    addManga,
    updateManga,
  ] = useMangaLibrary(
    (s) => [
      s.setMangas,
      s.resetSyncState,
      s.setError,
      s.deleteManga,
      s.addManga,
      s.updateManga,
    ],
    shallow,
  );
  const setSources = useMangaLibraryFilters((s) => s.setIncludeSources);
  const user = useUser();
  const library = useMongoClient(MangaSchema);
  const sourceMangas = useMongoClient(SourceMangaSchema);
  React.useEffect(() => {
    async function init() {
      resetSyncState();
      try {
        const data: IMangaSchema[] = await library.aggregate([
          { $match: { _realmId: user.id, inLibrary: true } },
          { $sort: { _id: 1 } },
        ]);
        const matching: Pick<IMangaSchema, 'link'>[] =
          await sourceMangas.aggregate([
            {
              $match: {
                link: { $in: data.map((x) => x.link) },
              },
            },
            {
              $project: {
                link: 1,
              },
            },
          ]);
        const p = new Set(matching.map((x) => x.link));
        const missing = data.filter((manga) => !p.has(manga.link));
        const append = await Promise.all(
          missing.map((x) => getMangaHost(x.source).getMeta(x)),
        );
        sourceMangas.insertMany(
          append.map((x) => ({
            _id: getSourceMangaId(x),
            description: x.description,
            imageCover: x.imageCover,
            link: x.link,
            source: x.source,
            title: x.title,
          })),
        );

        console.log(`Missing ${missing.length} mangas from SourceManga`);

        setMangas(data);
        setSources(data, true);
        // const info = data.reduce((prev, curr) => {
        //   if (prev[curr.source] == null) prev[curr.source] = [];
        //   prev[curr.source].push(curr._id);
        //   return prev;
        // }, {} as Record<string, string[]>);

        // const res = await fetch('/api/v1/manga', {
        //   method: 'PATCH',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ mangas: info }),
        // });
        // const c = await res.json();
        // console.log(c);
      } catch (e) {
        setError(e);
      }
    }
    async function listener() {
      for await (const change of library.watch({
        filter: { 'fullDocument._realmId': user.id },
      })) {
        switch (change.operationType) {
          case 'delete': // unreachable
            deleteManga(change.documentKey._id);
            break;
          case 'insert':
            addManga(change.fullDocument);
            break;
          case 'update':
            if (change.fullDocument != null) {
              if (change.fullDocument.inLibrary)
                updateManga(change.documentKey._id, change.fullDocument, {
                  upsert: true,
                });
              else deleteManga(change.documentKey._id);
            }
            break;
        }
      }
    }
    init();
    listener();
  }, [
    addManga,
    library,
    deleteManga,
    resetSyncState,
    setError,
    setMangas,
    updateManga,
    user.id,
    setSources,
    sourceMangas,
  ]);
  return <>{props.children}</>;
}
