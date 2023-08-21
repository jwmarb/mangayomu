import createContext from '@app/helpers/createContext';
import { ISourceMangaSchema } from '@mangayomu/schemas';

export const [MangaContext, useManga] = createContext<ISourceMangaSchema>();
