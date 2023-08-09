import Collection from '@app/realm/collection';
import { ISourceMangaSchema } from '@mangayomu/schemas';

export default class SourceMangaSchema extends Collection<ISourceMangaSchema>({
  name: 'SourceManga',
}) {}
