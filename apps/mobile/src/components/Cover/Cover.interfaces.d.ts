import { Manga } from '@mangayomu/mangascraper';
import { BookStyle } from '@redux/slices/settings';
import React from 'react';
import { SharedValue } from 'react-native-reanimated';

export interface CoverProps extends React.PropsWithChildren {
  cover?: Omit<Manga, 'index'> | string;
  scale?: number;
  normalBookDimensions?: boolean;
}

export interface CustomizableCoverProps extends React.PropsWithChildren {
  width: SharedValue<number>;
  height: SharedValue<number>;
  bookHeight: SharedValue<number>;
  bookStyle: BookStyle;
  src: string;
}
