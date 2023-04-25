import { SortChaptersMethod } from '@database/schemas/Manga';

export interface SortProps {
  sortMethod: SortChaptersMethod;
  reversed: boolean;
  mangaLink: string;
}
