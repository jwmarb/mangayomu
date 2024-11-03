import { Manga, MangaSource } from '@mangayomu/mangascraper';
import { isManga, isUnparsedManga } from '@/utils/helpers';
import { useSourceContext } from '@/components/composites/Manga';

/**
 * Converts an unknown manga object to a valid Manga object.
 *
 * @param manga - The manga object to convert. It can be a valid Manga object, an unparsed manga object,
 *                or any other type of object.
 * @param source - An optional parameter that can be a MangaSource instance or a string representing the source name.
 *                 This is used if the manga object needs to be converted using a specific source.
 * @returns A valid Manga object.
 * @throws {Error} If the provided manga cannot be converted to a valid Manga object.
 */
export default function useManga(
  manga: unknown,
  source?: MangaSource | string,
): Manga {
  // Get the current source context if it exists
  const sourceCtx = useSourceContext();

  // Check if the provided manga is already a valid Manga object
  if (isManga(manga)) {
    return manga;
  }

  // Check if the provided manga is an unparsed manga object
  if (isUnparsedManga(manga)) {
    const source = MangaSource.getSource(manga.__source__);
    return source.toManga(manga);
  }

  // If a source context or explicit source is provided, use it to convert the manga
  if (sourceCtx != null || source != null) {
    // Use the source context if available
    if (sourceCtx != null) return sourceCtx.toManga(manga);

    // Use the explicitly provided source
    if (source != null) {
      if (typeof source === 'string') {
        const s = MangaSource.getSource(source);
        return s.toManga(manga);
      }
      if (source != null) return source.toManga(manga);
    }
  }

  // Throw an error if none of the above conditions are met
  throw new Error(
    `Invalid conversion type to Manga:\n\n${JSON.stringify(manga, null, 2)}`,
  );
}
