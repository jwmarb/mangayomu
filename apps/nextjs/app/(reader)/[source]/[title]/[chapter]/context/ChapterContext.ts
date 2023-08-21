import createContext from '@app/helpers/createContext';
import { ISourceChapterSchema } from '@mangayomu/schemas';

export const [ChapterContext, useChapter] =
  createContext<ISourceChapterSchema>();
