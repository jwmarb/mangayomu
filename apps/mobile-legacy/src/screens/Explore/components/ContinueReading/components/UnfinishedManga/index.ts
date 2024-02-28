export { default } from './UnfinishedManga';
import { MangaSchema } from '@database/schemas/Manga';
import { ChapterSchema } from '@database/schemas/Chapter';
import { LocalChapterSchema } from '@database/schemas/LocalChapter';

export interface UnfinishedMangaProps {
  manga: MangaSchema;
}
