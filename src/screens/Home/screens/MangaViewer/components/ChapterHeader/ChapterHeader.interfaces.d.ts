import { MangaChapter } from '@services/scraper/scraper.interfaces';
import React from 'react';

export interface ChapterHeaderProps {
  chapters?: MangaChapter[];
  sort: string;
  loading: boolean;
  handleOnOpenModal: () => void;
}
