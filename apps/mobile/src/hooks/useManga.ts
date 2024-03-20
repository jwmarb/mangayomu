import { Manga, MangaSource } from '@mangayomu/mangascraper';
import { isManga, isUnparsedManga } from '@/utils/helpers';

export default function useManga(manga: unknown): Manga {
  if (isManga(manga)) {
    return manga;
  }

  if (isUnparsedManga(manga)) {
    const source = MangaSource.getSource(manga.__source__);
    return source.toManga(manga);
  }

  throw new Error(
    `Invalid conversion type to Manga:\n\n${JSON.stringify(manga, null, 2)}`,
  );
}
