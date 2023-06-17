import { Manga } from '@mangayomu/mangascraper';

export default function assertIsManga(t: unknown): t is Manga {
  return (
    typeof t === 'object' &&
    t != null &&
    'link' in t &&
    'imageCover' in t &&
    'source' in t &&
    'title' in t
  );
}
