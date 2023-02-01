import { Manga } from '@mangayomu/mangascraper';

export const keyExtractor = (i: Manga) => i.link + i.index;
