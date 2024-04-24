import { Manga, MangaSource } from '@mangayomu/mangascraper';
import { isManga, isUnparsedManga } from '@/utils/helpers';
import { useSourceContext } from '@/components/composites/Manga';

export default function useManga(
  manga: unknown,
  source?: MangaSource | string,
): Manga {
  const sourceCtx = useSourceContext();
  if (isManga(manga)) {
    return manga;
  }

  if (isUnparsedManga(manga)) {
    const source = MangaSource.getSource(manga.__source__);
    return source.toManga(manga);
  }

  if (sourceCtx != null || source != null) {
    if (sourceCtx != null) return sourceCtx.toManga(manga);
    if (source != null) {
      if (typeof source === 'string') {
        const s = MangaSource.getSource(source);
        return s.toManga(manga);
      }
      if (source != null) return source.toManga(manga);
    }
  }

  throw new Error(
    `Invalid conversion type to Manga:\n\n${JSON.stringify(manga, null, 2)}`,
  );
}
