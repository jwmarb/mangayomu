import createContext from '@app/helpers/createContext';
import { MangaHost } from '@mangayomu/mangascraper';

export const [MangaHostContext, useMangaHostContext] =
  createContext<MangaHost>();
