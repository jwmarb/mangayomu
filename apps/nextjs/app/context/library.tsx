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
import {
  IMangaSchema,
  ISourceMangaSchema,
  getSourceMangaId,
} from '@mangayomu/schemas';
import SourceMangaSchema from '@app/realm/SourceManga';
import getMangaHost from '@app/helpers/getMangaHost';
import { useMangaProxy } from '@app/context/proxy';
import { Manga, MangaChapter, MangaMeta } from '@mangayomu/mangascraper';
import { ISOLangCode } from '@mangayomu/language-codes';

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
  const proxy = useMangaProxy();
  const addSourceMangas = React.useCallback(
    async (missing: IMangaSchema[]) => {
      if (missing.length > 0) {
        const append = await Promise.allSettled(
          missing.map((x) => {
            const host = getMangaHost(x.source);
            host.proxy = proxy;
            return host.getMeta(x);
          }),
        );
        const p: (MangaMeta<MangaChapter> & Manga)[] = [];
        const defaultLanguages: Record<string, ISOLangCode> = {};
        for (const result of append) {
          switch (result.status) {
            case 'fulfilled': {
              const x = result.value;
              p.push(x);
              defaultLanguages[x.source] = getMangaHost(
                x.source,
              ).defaultLanguage;
              break;
            }
            case 'rejected': {
              console.error('Failed to fetch');
            }
          }
        }
        await user.functions.addSourceMangas(p, defaultLanguages);
      }
    },
    [proxy, user.functions],
  );
  React.useEffect(() => {
    async function init() {
      resetSyncState();
      try {
        const data: IMangaSchema[] = await library.aggregate([
          { $match: { _realmId: user.id, inLibrary: true } },
          { $sort: { _id: 1 } },
        ]);
        const matching: ({ _id: null; ids: string[] } | undefined)[] =
          await sourceMangas.aggregate([
            {
              $match: {
                _id: { $in: data.map((x) => getSourceMangaId(x)) },
              },
            },
            {
              $group: {
                _id: null,
                ids: {
                  $push: '$_id',
                },
              },
            },
          ]);
        const ids = matching[0] != null ? matching[0].ids : [];
        const p = new Set(ids);
        const missing = data.filter((manga) => !p.has(getSourceMangaId(manga)));

        addSourceMangas(missing);

        setMangas(data);
        setSources(data, true);
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
    addSourceMangas,
  ]);
  return <>{props.children}</>;
}
