import { useLocalRealm } from '@database/main';
import { LocalMangaSchema } from '@database/schemas/LocalManga';
import { getErrorMessage } from '@helpers/getErrorMessage';
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

const batches: Set<string> = new Set();
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
    _batchify(state) {
      state.count = 0;
    },
  },
});

/**
 * Unbatches mangas, indicating that the mangas have been resolved
 * @param batch Contains mangas that are to be resolved
 */
function unbatch(batch: Map<string, string[]>) {
  for (const links of batch.values()) {
    for (const link of links) {
      batches.delete(link);
    }
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
  /**
   * Creates a batch containing mangas that should be resolved. Mangas that are currently being resolved are not added in this batch.
   * @returns Returns a map with the mangas that should be resolved
   */
  function batchify() {
    const batch: Map<string, string[]> = new Map();
    for (const [source, mangaLinks] of mangas.entries()) {
      for (const link of mangaLinks) {
        if (!batches.has(link)) {
          const src = batch.get(source);
          if (src == null) batch.set(source, [link]);
          else src.push(link);
          batches.add(link);
        }
      }
    }
    dispatch(imageResolverSlice.actions._batchify());

    return batch;
  }

  React.useEffect(() => {
    if (initialized.current && count > 0) {
      const timeout = setTimeout(async () => {
        const batch = batchify();
        const manga: (Manga & MangaMeta<MangaChapter>)[] = [];
        const defaultLanguages: Record<string, string> = {};
        if (batch.size > 0) {
          try {
            for (const [source, links] of batch.entries()) {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const host = MangaHost.sourcesMap.get(source)!;
              defaultLanguages[source] = host.defaultLanguage;
              for (const link of links) {
                const meta = await host.getMeta({ link });
                manga.push(meta);
              }
            }
          } catch (e) {
            for (const links of batch.values()) {
              for (const link of links) {
                const listenersArr = listeners.get(link);
                if (listenersArr != null)
                  for (const listener of listenersArr) {
                    listener(null);
                  }
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

                const listenersArr = listeners.get(i.link);
                if (listenersArr != null)
                  for (const listener of listenersArr) {
                    listener(i.imageCover);
                  }
              }
            });
            user.functions.addSourceMangas(manga, defaultLanguages);
          }
        }
      }, 1);
      return () => {
        clearTimeout(timeout);
      };
    } else initialized.current = true;
  }, [count, user.functions]);

  return <>{children}</>;
};
