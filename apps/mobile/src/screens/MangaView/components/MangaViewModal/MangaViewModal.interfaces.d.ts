import { SortChaptersMethod } from '@database/schemas/Manga';
import React from 'react';

export interface MangaViewModalProps {
  sortMethod: SortChaptersMethod;
  reversed: boolean;
  mangaLink: string;
}
