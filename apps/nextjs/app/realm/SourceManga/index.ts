import Collection from '@app/realm/collection';
import { Manga } from '@mangayomu/mangascraper';

export interface ISourceMangaSchema extends Manga {
  _id: string;
}

export default class SourceMangaSchema extends Collection<ISourceMangaSchema>({
  name: 'SourceManga',
}) {}
