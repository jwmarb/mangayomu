import { useLocalRealm } from '@database/main';
import { LocalMangaSchema } from '@database/schemas/LocalManga';
import useAppSelector from '@hooks/useAppSelector';
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

export type ImageResolverListener = (result: string | null) => void;

interface ImageResolverState {
  count: number;
}

let batches: Set<string> = new Set();
const listeners: Map<string, ImageResolverListener[]> = new Map();
const mangas: Map<string, string[]> = new Map();

const initialImageResolverState: ImageResolverState = {
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
      if (!batches.has(action.payload.manga.link)) {
        if (!mangas.has(action.payload.manga.source))
          mangas.set(action.payload.manga.source, []);
        if (
          !listeners.has(action.payload.manga.link) &&
          action.payload.listener != null
        )
          listeners.set(action.payload.manga.link, []);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        mangas
          .get(action.payload.manga.source)!
          .push(action.payload.manga.link);
        state.count++;
        if (action.payload.listener != null) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          listeners
            .get(action.payload.manga.link)!
            .push(action.payload.listener);
        }
      }
    },
    unqueue(
      state,
      action: PayloadAction<{ manga: Manga; listener?: ImageResolverListener }>,
    ) {
      if (!batches.has(action.payload.manga.link)) {
        if (mangas.has(action.payload.manga.source)) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const r = mangas.get(action.payload.manga.source)!;
          mangas.set(
            action.payload.manga.source,
            r.filter((x) => x !== action.payload.manga.link),
          );
        }
        if (
          action.payload.listener != null &&
          listeners.has(action.payload.manga.link)
        ) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const r = listeners.get(action.payload.manga.link)!;
          listeners.set(
            action.payload.manga.link,
            r.filter((x) => x !== action.payload.listener),
          );
        }
        state.count--;
        if (mangas.get(action.payload.manga.source)?.length === 0)
          mangas.delete(action.payload.manga.source);
        if (
          listeners.get(action.payload.manga.link)?.length === 0 &&
          action.payload.listener != null
        )
          listeners.delete(action.payload.manga.link);
      }
    },
    _batchify(state, action: PayloadAction<Set<string>>) {
      mangas.clear();
      listeners.clear();
      state.count = 0;
      batches = action.payload;
    },
  },
});

function unbatch(batch: Set<string>) {
  for (const link of batch) {
    batches.delete(link);
  }
}

export const { queue, unqueue } = imageResolverSlice.actions;
export default imageResolverSlice.reducer;

export const ImageResolver: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const count = useAppSelector((state) => state.imageResolver.count);
  const localRealm = useLocalRealm();
  const dispatch = useAppDispatch();
  const initialized = React.useRef<boolean>(false);
  const user = useUser();
  function batchify() {
    const batch: Set<string> = new Set();
    for (const source of mangas.values()) {
      for (const link of source) {
        batch.add(link);
        batches.add(link);
      }
    }
    dispatch(imageResolverSlice.actions._batchify(batches));
    return batch;
  }

  React.useEffect(() => {
    if (initialized.current && count > 0) {
      const timeout = setTimeout(async () => {
        const batch = batchify();
        const manga: (Manga & MangaMeta<MangaChapter>)[] = [];
        try {
          for (const source of mangas.keys()) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const host = MangaHost.sourcesMap.get(source)!;
            console.log(`Resolving ${mangas.size} manga(s) ...`);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            for (const link of mangas.get(source)!) {
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
              listeners.get(link)?.forEach((listener) => {
                listener(null);
              });
            }
          }
        } finally {
          unbatch(batch);
          localRealm.write(() => {
            for (const i of manga) {
              const realmObj = localRealm.objectForPrimaryKey(
                LocalMangaSchema,
                i.link,
              );
              if (realmObj != null) realmObj.imageCover = i.imageCover;

              listeners.get(i.link)?.forEach((listener) => {
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
