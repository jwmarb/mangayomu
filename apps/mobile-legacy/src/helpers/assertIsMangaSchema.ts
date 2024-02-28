import { MangaSchema } from '@database/schemas/Manga';

export default function assertIsMangaSchema(t: unknown): t is MangaSchema {
  return (
    typeof t === 'object' &&
    t != null &&
    'link' in t &&
    typeof t.link === 'string' &&
    'imageCover' in t &&
    'source' in t &&
    'title' in t &&
    '_realmId' in t &&
    '_id' in t
  );
}
