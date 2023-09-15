import Collection from '@app/realm/collection';
import { ISourceChapterSchema } from '@mangayomu/schemas';

export default class SourceChapterSchema extends Collection<ISourceChapterSchema>(
  {
    name: 'SourceChapter',
  },
) {}
