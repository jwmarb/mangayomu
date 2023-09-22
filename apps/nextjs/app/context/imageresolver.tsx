'use client';
import React from 'react';
import type { Manga, MangaChapter, MangaMeta } from '@mangayomu/mangascraper';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import collectMangaMetas from '@app/helpers/collectMangaMetas';
import { enableMapSet } from 'immer';
import getMangaHost from '@app/helpers/getMangaHost';
import { useMangaProxy } from '@app/context/proxy';
import { useUser } from '@app/context/realm';
enableMapSet();

export type ImageResolverListener = (result: string) => void;

interface ImageResolverStore {
  mangas: Record<string, string[]>;
  listeners: Record<string, ImageResolverListener[]>;
  batches: Set<string>;
  count: number;
  queue(
    manga: Manga,
    listener?: ImageResolverListener,
  ): { unqueue: () => void };
  clear(): void;
  batchify(): Set<string>;
  unbatch(batch: Set<string>): void;
}

export const IMAGE_PLACEHOLDER = '/No-Image-Placeholder.png';

export const useImageResolver = create(
  immer<ImageResolverStore>((set, get) => ({
    mangas: {},
    listeners: {},
    count: 0,
    batches: new Set(),
    queue(manga, listener) {
      if (!get().batches.has(manga.link))
        set((state) => {
          if (manga.source in state.mangas === false)
            state.mangas[manga.source] = [];
          if (manga.link in state.listeners === false && listener != null)
            state.listeners[manga.link] = [];
          state.mangas[manga.source].push(manga.link);
          state.count++;
          if (listener != null) state.listeners[manga.link].push(listener);
        });
      return {
        unqueue() {
          if (!get().batches.has(manga.link))
            set((state) => {
              if (state.mangas[manga.source])
                state.mangas[manga.source] = state.mangas[manga.source].filter(
                  (x) => x !== manga.link,
                );
              if (listener != null && state.listeners[manga.link])
                state.listeners[manga.link] = state.listeners[
                  manga.link
                ].filter((x) => x !== listener);
              state.count--;
              if (state.mangas[manga.source]?.length === 0)
                delete state.mangas[manga.source];
              if (state.listeners[manga.link]?.length === 0 && listener != null)
                delete state.listeners[manga.link];
            });
        },
      };
    },
    clear() {
      set((state) => {
        state.mangas = {};
        state.listeners = {};
        state.count = 0;
      });
    },
    batchify() {
      const batch = new Set<string>();
      const copy = new Set(get().batches);
      for (const source in get().mangas) {
        for (const link in get().mangas[source]) {
          batch.add(link);
          copy.add(link);
        }
      }
      set((state) => {
        state.mangas = {};
        state.listeners = {};
        state.count = 0;

        state.batches = copy;
      });
      return batch;
    },
    unbatch(batch: Set<string>) {
      set((state) => {
        const copy = new Set(state.batches);
        batch.forEach((x) => copy.delete(x));
        state.batches = copy;
      });
    },
  })),
);

export default function ImageResolver({ children }: React.PropsWithChildren) {
  const proxy = useMangaProxy();
  const { mangas, clear, listeners, count, batchify, unbatch, batches } =
    useImageResolver();
  const user = useUser();
  const initialized = React.useRef<boolean>(false);

  React.useEffect(() => {
    if (initialized.current && count > 0) {
      const timeout = setTimeout(async () => {
        const batch = batchify();
        const manga: (Manga & MangaMeta<MangaChapter>)[] = [];
        try {
          for (const source in mangas) {
            const host = getMangaHost(source);
            host.proxy = proxy;
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
                listener(IMAGE_PLACEHOLDER);
              });
            }
          }
        } finally {
          unbatch(batch);
          for (const i of manga) {
            listeners[i.link].forEach((listener) => {
              listener(i.imageCover || IMAGE_PLACEHOLDER);
            });
          }
          user.functions
            .addSourceMangas(
              manga,
              manga.reduce((prev, curr) => {
                prev[curr.source] = getMangaHost(curr.source).defaultLanguage;
                return prev;
              }, {} as Record<string, string>),
            )
            .then((x) => console.log({ ...x, fn_call: 'addSourceMangas' }));
        }
      }, 1);
      return () => {
        clearTimeout(timeout);
      };
    } else initialized.current = true;
  }, [clear, listeners, mangas, count, batchify, unbatch, proxy]);

  return <>{children}</>;
}
