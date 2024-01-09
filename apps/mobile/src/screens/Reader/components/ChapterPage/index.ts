export { default } from './ChapterPage';
import {
  ChapterPage,
  ExtendedReaderPageState,
} from '@redux/slices/reader/reader';
import {
  ImageScaling,
  ReadingDirection,
  ZoomStartPosition,
} from '@redux/slices/settings';
import { ImageMenuMethods } from '@screens/Reader/components/ImageMenu';
import { PageGestures } from '@screens/Reader/hooks/useOverlayGesture';
import { NativeGesture, PinchGesture } from 'react-native-gesture-handler';

export interface ChapterPageProps {
  page: ChapterPage;
  extendedPageState?: ExtendedReaderPageState;
}

export type PageAnimatedStateBase = {
  translateX: number;
  translateY: number;
  initialTranslateX: number;
  initialTranslateY: number;
  scale: number;
  minScale: number;
};

export type PageAnimatedState = PageAnimatedStateBase & {
  onImageTypeChange: () => PageAnimatedStateBase;
  onDimensionsChange: (width: number, height: number) => PageAnimatedStateBase;
};

export interface ChapterPageContextState {
  animatedPreviousState: React.MutableRefObject<
    Record<string, PageAnimatedState | undefined>
  >;
  rootPinchGesture: PinchGesture;
  readingDirection: ReadingDirection;
  sourceName: string;
  mangaTitle: string;
  imageMenuRef: React.RefObject<ImageMenuMethods>;
  pageGestures: PageGestures;
  imageScaling: ImageScaling;
  zoomStartPosition: ZoomStartPosition;
  nativeFlatListGesture: NativeGesture;
}
