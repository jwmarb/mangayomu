export { default } from './MangaGenres';
import { MangaMetaProperty } from '@screens/MangaView/components/MangaViewerHeader/';

export interface MangaGenresProps extends MangaMetaProperty<'genres'> {
  source: string;
}
