import { LocalMangaSchema } from '@database/schemas/LocalManga';
import { MangaSchema } from '@database/schemas/Manga';
import assertIsLocalMangaSchema from '@helpers/assertIsLocalMangaSchema';
import assertIsMangaSchema from '@helpers/assertIsMangaSchema';
import { Manga } from '@mangayomu/mangascraper/src';

export default function mangaSchemaToManga(
  manga: Manga | MangaSchema | LocalMangaSchema,
): Manga {
  if (assertIsMangaSchema(manga))
    return {
      imageCover: manga.imageCover,
      link: manga.link,
      title: manga.title,
      source: manga.source,
    };
  else if (assertIsLocalMangaSchema(manga))
    return {
      imageCover: manga.imageCover,
      link: manga._id,
      title: manga.title,
      source: manga.source,
    };
  return manga;
}
