import { MangaMetaProperty } from '@screens/MangaView/components/MangaViewerHeader/MangaViewerHeader.interfaces';
import React from 'react';

export interface MangaGenresProps extends MangaMetaProperty<'genres'> {
  source: string;
}
