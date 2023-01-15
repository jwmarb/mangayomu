import { Manga } from '@services/scraper/scraper.interfaces';
import MangaValidator from '@utils/MangaValidator';

/**
 * Create a filter query predicate
 * @param query The string that should be compared to
 * @returns Returns a filter predicate that determines whether query is in title of a manga
 */
export default function titleIncludes(query: string): (x: Manga) => boolean {
  return (x) =>
    x.title.trim().toLowerCase().includes(query.trim().toLowerCase()) ||
    (MangaValidator.hasAltTitles(x) && x.altTitles.some((x) => x.toLowerCase().includes(query.trim().toLowerCase())));
}
