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
import { PanGesture, PinchGesture } from 'react-native-gesture-handler';
import { SharedValue } from 'react-native-reanimated';

export interface ChapterPageProps {
  page: ChapterPage;
  extendedPageState?: ExtendedReaderPageState;
}

export type PageAnimatedStateBase = {
  translateX: number;
  translateY: number;
  scale: number;
  minScale: number;
};

export type PageAnimatedState = PageAnimatedStateBase & {
  onImageTypeChange: () => PageAnimatedStateBase;
  onDimensionsChange: (width: number, height: number) => PageAnimatedStateBase;
};

export interface ChapterPageContextState {
  velocityX: SharedValue<number>;
  velocityY: SharedValue<number>;
  animatedPreviousState: React.MutableRefObject<
    Record<string, PageAnimatedState | undefined>
  >;
  rootPanGesture: PanGesture;
  rootPinchGesture: PinchGesture;
  readingDirection: ReadingDirection;
  sourceName: string;
  mangaTitle: string;
  imageMenuRef: React.RefObject<ImageMenuMethods>;
  pageGestures: PageGestures;
  imageScaling: ImageScaling;
  zoomStartPosition: ZoomStartPosition;
}
