import { MangaSchema } from '@database/schemas/Manga';
import assertIsManga from '@helpers/assertIsManga';
import { Manga } from '@mangayomu/mangascraper/src';

export default function mangaSchemaToManga(manga: Manga | MangaSchema): Manga {
  if (!assertIsManga(manga))
    return {
      imageCover: manga.imageCover,
      link: manga._id,
      title: manga.title,
      source: manga.source,
    };
  return manga;
}
