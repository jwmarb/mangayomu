'use client';
import React from 'react';
import type { Manga } from '@mangayomu/mangascraper';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import collectMangaMetas from '@app/helpers/collectMangaMetas';
import { enableMapSet } from 'immer';
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

const IMAGE_PLACEHOLDER = '/No-Image-Placeholder.png';

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
  const { mangas, clear, listeners, count, batchify, unbatch, batches } =
    useImageResolver();
  const initialized = React.useRef<boolean>(false);

  React.useEffect(() => {
    if (initialized.current && count > 0) {
      const timeout = setTimeout(async () => {
        const batch = batchify();
        try {
          const p = await collectMangaMetas(mangas);
          for (const manga of p) {
            listeners[manga.link].forEach((listener) => {
              listener(manga.imageCover || IMAGE_PLACEHOLDER);
            });
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
        }
      }, 10);
      return () => {
        clearTimeout(timeout);
      };
    } else initialized.current = true;
  }, [clear, listeners, mangas, count, batchify, unbatch]);

  return <>{children}</>;
}
