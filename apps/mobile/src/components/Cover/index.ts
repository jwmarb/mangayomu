import Cover from './Cover';
export default Cover;
export { default as CustomizableCover } from './Cover.customizable';
export { default as StaticCover } from './Cover.static';
import { Manga } from '@mangayomu/mangascraper/src';
import { BookStyle } from '@redux/slices/settings';
import React from 'react';
import { SharedValue } from 'react-native-reanimated';

export interface CoverProps extends React.PropsWithChildren {
  cover?: Manga | string | null;
  manga: Manga;
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
