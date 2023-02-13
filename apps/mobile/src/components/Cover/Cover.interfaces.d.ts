import { Manga } from '@mangayomu/mangascraper';
import React from 'react';

export interface CoverProps extends React.PropsWithChildren {
  cover?: Omit<Manga, 'index'> | string;
  scale?: number;
}
