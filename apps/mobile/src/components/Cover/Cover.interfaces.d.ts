import { Manga } from '@mangayomu/mangascraper';
import React from 'react';
import { SharedValue } from 'react-native-reanimated';

export interface CoverProps extends React.PropsWithChildren {
  cover?: Omit<Manga, 'index'> | string;
  scale?: number;
}

export interface CustomizableCoverProps {
  width: SharedValue<number>;
  height: SharedValue<number>;
  src: string;
}
