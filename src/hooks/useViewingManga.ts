import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '@redux/store';
import { Manga } from '@services/scraper/scraper.interfaces';
import { ReadingMangaInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';

export default function useViewingManga(manga: Manga): ReadingMangaInfo {
  return useSelector((state: AppState) => state.mangas[manga.title]);
}
