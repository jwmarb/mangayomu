import { InvalidSourceException, MangaSource } from '@mangayomu/mangascraper';
import { isManga, isUnparsedManga } from '@/utils/helpers';

type UseMangaSourceOptions =
  | {
      manga: unknown;
    }
  | {
      source: string;
    };

export default function useMangaSource(options: UseMangaSourceOptions) {
  if ('manga' in options) {
    if (isManga(options.manga)) {
      const source = MangaSource.getSource(options.manga.source);
      if (source != null) return source;
      throw new InvalidSourceException(options.manga.source);
    }

    if (isUnparsedManga(options.manga)) {
      const source = MangaSource.getSource(options.manga.__source__);
      if (source != null) return source;
      throw new InvalidSourceException(options.manga.__source__);
    }
  }
  if ('source' in options) {
    const source = MangaSource.getSource(options.source);
    if (source != null) return source;
    throw new InvalidSourceException(options.source);
  }
  throw new Error(
    'Invalid options prop passed into `useMangaSource`\n' +
      JSON.stringify(options, null, 2),
  );
}
