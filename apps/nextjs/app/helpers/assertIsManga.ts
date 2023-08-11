import { Manga } from '@mangayomu/mangascraper';

export default function assertIsManga(x: unknown): x is Manga {
  return (
    typeof x === 'object' &&
    x != null &&
    'link' in x &&
    'title' in x &&
    'source' in x &&
    'imageCover' in x
  );
}
