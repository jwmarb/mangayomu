import { createContext } from '@/utils/context';
import { Manga } from '@mangayomu/mangascraper';
import React from 'react';

export const { Provider: SetStateProvider, useContext: useSetState } =
  createContext<(newValue: any) => Promise<void>>();

export const { Provider: MangaProvider, useContext: useMangaContext } =
  createContext<Manga>(false);

export const { Provider: ForThisSeriesProvider, useContext: useForThisSeries } =
  createContext<Manga>();
