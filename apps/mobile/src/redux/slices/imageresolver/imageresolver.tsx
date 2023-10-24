import { useLocalRealm } from '@database/main';
import { LocalMangaSchema } from '@database/schemas/LocalManga';
import useAppSelector from '@hooks/useAppSelector';
import { StringComparator, integrateSortedList } from '@mangayomu/algorithms';
import {
  Manga,
  MangaChapter,
  MangaHost,
  MangaMeta,
} from '@mangayomu/mangascraper/src';
import { useUser } from '@realm/react';
import { useAppDispatch } from '@redux/main';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import React from 'react';
import { InteractionManager } from 'react-native';

export type ImageResolverListener = (result: string | null) => void;

interface ImageResolverState {
  mangas: Record<string, string[]>;
  listeners: Record<string, ImageResolverListener[]>;
  batches: string[];
  count: number;
}

const initialImageResolverState: ImageResolverState = {
  mangas: {},
  listeners: {},
  batches: [],
  count: 0,
};

const imageResolverSlice = createSlice({
  name: 'imageResolver',
  initialState: initialImageResolverState,
  reducers: {
    queue(
      state,
      action: PayloadAction<{ manga: Manga; listener?: ImageResolverListener }>,
    ) {
      const p = integrateSortedList(state.batches, StringComparator);
      if (p.indexOf(action.payload.manga.link) === -1) {
        if (action.payload.manga.source in state.mangas === false)
          state.mangas[action.payload.manga.source] = [];
        if (
          action.payload.manga.link in state.listeners === false &&
          action.payload.listener != null
        )
          state.listeners[action.payload.manga.link] = [];
        state.mangas[action.payload.manga.source].push(
          action.payload.manga.link,
        );
        state.count++;
        if (action.payload.listener != null)
          state.listeners[action.payload.manga.link].push(
            action.payload.listener,
          );
      }
    },
    unqueue(
      state,
      action: PayloadAction<{ manga: Manga; listener?: ImageResolverListener }>,
    ) {
      const p = integrateSortedList(state.batches, StringComparator);
      if (p.indexOf(action.payload.manga.link) === -1) {
        if (state.mangas[action.payload.manga.source])
          state.mangas[action.payload.manga.source] = state.mangas[
            action.payload.manga.source
          ].filter((x) => x !== action.payload.manga.link);
        if (
          action.payload.listener != null &&
          state.listeners[action.payload.manga.link]
        )
          state.listeners[action.payload.manga.link] = state.listeners[
            action.payload.manga.link
          ].filter((x) => x !== action.payload.listener);
        state.count--;
        if (state.mangas[action.payload.manga.source]?.length === 0)
          delete state.mangas[action.payload.manga.source];
        if (
          state.listeners[action.payload.manga.link]?.length === 0 &&
          action.payload.listener != null
        )
          delete state.listeners[action.payload.manga.link];
      }
    },
    _batchify(state, action: PayloadAction<string[]>) {
      state.mangas = {};
      state.listeners = {};
      state.count = 0;
      state.batches = action.payload;
    },
    unbatch(state, action: PayloadAction<string[]>) {
      const p = integrateSortedList(state.batches, StringComparator);
      for (const link of action.payload) {
        p.remove(link);
      }
    },
  },
});

export const { queue, unqueue } = imageResolverSlice.actions;
export default imageResolverSlice.reducer;

export const ImageResolver: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const mangas = useAppSelector((state) => state.imageResolver.mangas);
  const listeners = useAppSelector((state) => state.imageResolver.listeners);
  const count = useAppSelector((state) => state.imageResolver.count);
  const batches = useAppSelector((state) => state.imageResolver.batches);
  const localRealm = useLocalRealm();
  const dispatch = useAppDispatch();
  const initialized = React.useRef<boolean>(false);
  const user = useUser();
  function batchify() {
    const batch: string[] = [];
    const batchSorted = integrateSortedList(batch, StringComparator);
    const copy = [...batches];
    const copySorted = integrateSortedList(copy, StringComparator);
    for (const source in mangas) {
      for (const link in mangas[source]) {
        batchSorted.add(link);
        copySorted.add(link);
      }
    }
    dispatch(imageResolverSlice.actions._batchify(copy));
    return batch;
  }

  React.useEffect(() => {
    if (initialized.current && count > 0) {
      const timeout = setTimeout(async () => {
        const batch = batchify();
        const manga: (Manga & MangaMeta<MangaChapter>)[] = [];
        try {
          for (const source in mangas) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const host = MangaHost.sourcesMap.get(source)!;
            console.log(`Resolving ${mangas[source].length} manga(s) ...`);
            for (const link of mangas[source]) {
              try {
                const d = await host.getMeta({
                  link,
                });
                manga.push(d);
              } catch (e) {
                console.error(`Failed to fetch ${link}`);
              }
            }
          }
        } catch (e) {
          for (const source in mangas) {
            for (const link of source) {
              listeners[link].forEach((listener) => {
                listener(null);
              });
            }
          }
        } finally {
          dispatch(imageResolverSlice.actions.unbatch(batch));
          localRealm.write(() => {
            for (const i of manga) {
              localRealm.create(
                LocalMangaSchema,
                { _id: i.link, imageCover: i.imageCover },
                Realm.UpdateMode.Modified,
              );
              listeners[i.link].forEach((listener) => {
                listener(i.imageCover || null);
              });
            }
          });
          user.functions.addSourceMangas(
            manga,
            manga.reduce((prev, curr) => {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              prev[curr.source] = MangaHost.sourcesMap.get(
                curr.source,
              )!.defaultLanguage;
              return prev;
            }, {} as Record<string, string>),
          );
        }
      }, 1);
      return () => {
        clearTimeout(timeout);
      };
    } else initialized.current = true;
  }, [listeners, mangas, count, batchify, user.functions]);

  return <>{children}</>;
};
