import { Manga } from '@mangayomu/mangascraper/src';

export default function assertIsManga(t: unknown): t is Manga {
  return (
    typeof t === 'object' &&
    t != null &&
    'link' in t &&
    typeof t.link === 'string' &&
    'imageCover' in t &&
    'source' in t &&
    'title' in t &&
    '_realmId' in t === false
  );
}
