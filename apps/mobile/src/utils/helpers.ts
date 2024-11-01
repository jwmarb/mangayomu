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

export function isUnparsedManga(obj: unknown): obj is MangaResult {
  return (
    obj != null &&
    typeof obj === 'object' &&
    '__source__' in obj &&
    typeof obj.__source__ === 'string'
  );
}

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
