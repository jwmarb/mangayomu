export { default } from './UnfinishedManga';
import { MangaSchema } from '@database/schemas/Manga';
import { ChapterSchema } from '@database/schemas/Chapter';

export interface UnfinishedMangaProps {
  manga: MangaSchema;
  chapters: Realm.Results<ChapterSchema>;
}
