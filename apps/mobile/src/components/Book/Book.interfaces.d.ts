import { Manga } from '@mangayomu/mangascraper';

export interface BookProps {
  manga: Omit<Manga, 'index'>;
}
