import { LocalMangaSchema } from '@database/schemas/LocalManga';

export default function assertIsLocalMangaSchema(
  x: unknown,
): x is LocalMangaSchema {
  return (
    typeof x === 'object' &&
    x != null &&
    '_id' in x &&
    typeof x._id === 'string' &&
    'title' in x &&
    'source' in x &&
    'imageCover' in x
  );
}
