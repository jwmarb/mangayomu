import { MangaMetaProperty } from '@screens/MangaView/components/MangaViewerHeader/MangaViewerHeader.interfaces';

export interface MangaGenresProps extends MangaMetaProperty<'genres'> {
  source: string;
}
