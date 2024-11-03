import { Manga, MangaChapter } from '@mangayomu/mangascraper';
import { MangaResult } from '@/stores/explore';

/**
 * Extracts a human-readable error message from an unknown error object.
 *
 * This function checks the provided `err` parameter for common properties that
 * might contain an error message, such as `message`, `msg`, and `stack`. If none
 * of these properties are found or if they are empty, it returns a default message.
 *
 * @param {unknown} err - The error object to extract the message from.
 * @returns {string} A human-readable error message.
 */
export function getErrorMessage(err: unknown): string {
  // Check if `err` is a non-empty string and return it directly
  if (typeof err === 'string' && err) return err;
  if (typeof err === 'object' && err != null) {
    // Check if the `message` property exists, is a non-empty string, and return it
    if ('message' in err && typeof err.message === 'string' && err.message)
      return err.message;
    if ('msg' in err && typeof err.msg === 'string' && err.msg) return err.msg;
    if ('stack' in err && typeof err.stack === 'string' && err.stack)
      return err.stack;
  }

  // Return a default message if no error message properties are found
  return 'No error code/message has been provided';
}

/**
 * Checks if the given object is a valid `Manga` instance.
 *
 * This function performs several checks to ensure that the provided object
 * meets the criteria for being a `Manga`. It verifies the presence and types
 * of required properties such as `source`, `title`, and `link`, and optionally
 * checks for `imageCover` and `language`.
 *
 * @param {unknown} obj - The object to check.
 * @returns {obj is Manga} A boolean indicating whether the object is a valid `Manga`.
 */
export function isManga(obj: unknown): obj is Manga {
  return (
    obj != null &&
    typeof obj === 'object' &&
    'source' in obj &&
    'title' in obj &&
    'link' in obj &&
    typeof obj.source === 'string' &&
    ('imageCover' in obj === false ||
      typeof obj.imageCover === 'string' ||
      obj.imageCover == null) && // ~p v q
    typeof obj.link === 'string' &&
    ('language' in obj === false ||
      typeof obj.language === 'string' ||
      obj.language == null) && // ~p v q
    typeof obj.title === 'string'
  );
}

/**
 * Determines whether the given object is an unparsed manga result.
 *
 * This function checks if the input object meets the criteria to be considered an unparsed manga result. Specifically,
 * it verifies that the object is not null, is of type 'object', contains a '__source__' property, and that this property
 * is a string. If all these conditions are met, the function returns true; otherwise, it returns false.
 *
 * @param  obj          The object to be checked for being an unparsed manga result.
 *
 * @returns A boolean indicating whether the input object is an unparsed manga result.
 */
export function isUnparsedManga(obj: unknown): obj is MangaResult {
  return (
    obj != null &&
    typeof obj === 'object' &&
    '__source__' in obj &&
    typeof obj.__source__ === 'string'
  );
}

/**
 * Joins multiple path segments into a single path string.
 * This function ensures that there are no redundant slashes between segments and
 * handles edge cases such as leading and trailing slashes appropriately.
 *
 * @pre    At least one path segment must be provided; each path segment is a non-empty string.
 * @post   The resulting path will have no redundant slashes and will maintain the correct structure.
 *         If only one path segment is provided and it ends with a slash, that slash will be removed.
 * @param  {...paths} - A variable number of path segments to join. Each segment should be a string.
 *                      The first segment can start with or without a leading slash; subsequent segments
 *                      can have a leading slash which will be handled appropriately.
 *
 * @returns A single, correctly formatted path string that combines all provided segments.
 *
 * @example
 * // Returns "folder/subfolder/file"
 * joinPath("folder", "subfolder", "file");
 *
 * @example
 * // Returns "/folder/subfolder/file"
 * joinPath("/folder", "subfolder", "file");
 *
 * @example
 * // Returns "folder/subfolder/file/"
 * joinPath("folder", "subfolder/", "file/");
 */
export function joinPath(...paths: string[]): string {
  let joined = paths[0];
  for (let i = 1, n = paths.length; i < n; i++) {
    switch (joined[joined.length - 1]) {
      case '/': {
        if (paths[i][0] === '/') {
          joined += paths[i].substring(1);
        } else {
          joined += paths[i];
        }
        break;
      }
      default: {
        if (paths[i][0] === '/') {
          joined += paths[i];
        } else {
          joined += '/' + paths[i];
        }
        break;
      }
    }
  }
  if (joined[joined.length - 1] === '/' && paths.length < 2) {
    joined = joined.substring(0, joined.length - 1);
  }
  return joined;
}

/**
 * Determines whether the given object is a valid MangaChapter.
 *
 * This function checks if the input object has all the necessary properties
 * that define a MangaChapter. Specifically, it ensures that the object:
 * - Is of type 'object'
 * - Is not null
 * - Contains a 'name' property that is a string
 * - Contains a 'date' property (type is not checked)
 * - Contains a 'link' property that is a string
 *
 * @post   The function returns a boolean value indicating whether `x` is a valid MangaChapter.
 * @param  x - The object to check. This can be any type, but the function will only return true if it matches the structure of a MangaChapter.
 *
 * @returns A boolean value: `true` if `x` is a valid MangaChapter, otherwise `false`.
 */
export function isChapter(x: unknown): x is MangaChapter {
  return (
    typeof x === 'object' &&
    x != null &&
    'name' in x &&
    typeof x.name === 'string' &&
    'date' in x &&
    'link' in x &&
    typeof x.link === 'string'
  );
}
