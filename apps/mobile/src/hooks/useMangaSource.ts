import { InvalidSourceException, MangaSource } from '@mangayomu/mangascraper';
import { isManga, isUnparsedManga } from '@/utils/helpers';

// Define a type for options used in a function or component that deals with manga sources.
type UseMangaSourceOptions =
  // The options can either provide a manga object or a source string.
  | {
      manga: unknown; // The manga object, which could be of any type (to be validated later).
    }
  | {
      source: string; // A string representing the source of the manga.
    };

/**
 * This function determines and returns a manga source based on the provided options.
 * It supports two forms of input:
 * - An object with a `manga` property, which can be either a valid manga object or an unparsed manga object.
 * - An object with a `source` property, which is a string representing the source name.
 *
 * If the `manga` property is provided and it's a valid manga object, the function retrieves its source using the `MangaSource.getSource` method.
 * If the `manga` property is an unparsed manga object, the function retrieves its source from the `__source__` property.
 * If the `source` property is provided, the function directly uses it to retrieve the manga source.
 *
 * If the source cannot be found or if the options are invalid, appropriate exceptions are thrown.
 *
 * @param {UseMangaSourceOptions} options - The options object containing either a `manga` or `source` property.
 * @returns {MangaSource} The manga source based on the provided options.
 * @throws {InvalidSourceException} If the specified source is not found.
 * @throws {Error} If the options are invalid or neither `manga` nor `source` is present.
 */
export default function useMangaSource(options: UseMangaSourceOptions) {
  // Check if the 'manga' property is present in the options object
  if ('manga' in options) {
    // If the manga is a valid manga object, get its source
    if (isManga(options.manga)) {
      const source = MangaSource.getSource(options.manga.source);
      if (source != null) return source;
      throw new InvalidSourceException(options.manga.source);
    }

    // If the manga is an unparsed manga object, get its source from the __source__ property
    if (isUnparsedManga(options.manga)) {
      const source = MangaSource.getSource(options.manga.__source__);
      if (source != null) return source;
      throw new InvalidSourceException(options.manga.__source__);
    }
  }

  // Check if the 'source' property is present in the options object
  if ('source' in options) {
    // Get the manga source based on the provided source string
    const source = MangaSource.getSource(options.source);
    if (source != null) return source;
    throw new InvalidSourceException(options.source);
  }

  // If neither 'manga' nor 'source' is present, or they are invalid, throw an error
  throw new Error(
    'Invalid options prop passed into `useMangaSource`\n' +
      JSON.stringify(options, null, 2),
  );
}
