import { SortChaptersBy } from '@mangayomu/schemas';

export interface SortProps {
  sortMethod: SortChaptersBy;
  reversed: boolean;
  mangaLink: string;
}
