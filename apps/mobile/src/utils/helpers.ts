import { Manga } from '@mangayomu/mangascraper';
import { MangaResult } from '@/stores/explore';

export function getErrorMessage(err: unknown): string {
  if (typeof err === 'string') return err;
  if (typeof err === 'object' && err != null) {
    if ('message' in err && typeof err.message === 'string') return err.message;
    if ('msg' in err && typeof err.msg === 'string') return err.msg;
    if ('stack' in err && typeof err.stack === 'string') return err.stack;
  }
  return 'No error code/message has been provided';
}

export function isManga(obj: unknown): obj is Manga {
  return (
    obj != null &&
    typeof obj === 'object' &&
    'source' in obj &&
    'title' in obj &&
    'imageCover' in obj &&
    'link' in obj &&
    'language' in obj &&
    typeof obj.source === 'string' &&
    (typeof obj.imageCover === 'string' || obj.imageCover == null) &&
    typeof obj.link === 'string' &&
    (typeof obj.language === 'string' || obj.language == null) &&
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
