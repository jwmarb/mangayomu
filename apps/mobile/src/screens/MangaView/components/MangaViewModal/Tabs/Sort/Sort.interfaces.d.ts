import { SortChaptersMethod } from '@database/schemas/Manga';
import React from 'react';

export interface SortProps {
  sortMethod: SortChaptersMethod;
  reversed: boolean;
  mangaLink: string;
}
