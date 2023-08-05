import React from 'react';
export { default as LoadingBook } from './Book.skeleton';
import LoadingBook from './Book.skeleton';
import { Manga } from '@mangayomu/mangascraper/src';
import { SharedValue } from 'react-native-reanimated';
import { BookStyle, TitleAlignment } from '@redux/slices/settings';
export {
  default as CustomizableBook,
  BOOK_COVER_RATIO,
} from './Book.customizable';
const LazyBook = React.lazy(() => import('./Book'));

export interface BookProps {
  manga: Manga;
}

export interface CustomizableBookProps
  extends Omit<Manga, 'link'>,
    React.PropsWithChildren {
  width: SharedValue<number>;
  height: SharedValue<number>;
  fontSize: SharedValue<number>;
  bold: boolean;
  letterSpacing: SharedValue<number>;
  align: TitleAlignment;
  bookStyle: BookStyle;
}

export default function Book(props: BookProps) {
  return (
    <React.Suspense fallback={<LoadingBook />}>
      <LazyBook {...props} />
    </React.Suspense>
  );
}
