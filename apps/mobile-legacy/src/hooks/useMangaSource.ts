import { MangaSchema } from '@database/schemas/Manga';
import { Manga, MangaHost } from '@mangayomu/mangascraper/src';

const availableSources = MangaHost.sourcesMap;

export default function useMangaSource(src: string | Manga | MangaSchema) {
  const p = availableSources.get(typeof src === 'string' ? src : src.source);
  if (p == null) throw Error(`${src} is not a valid source.`);
  return p;
}
