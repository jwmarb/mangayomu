export { default } from './PageSliderNavigator';
export interface PageSliderNavigatorProps {
  style: Record<string, unknown>;
  totalPages?: number;
  onSkipPrevious: () => void;
  onSkipNext: () => void;
  onSnapToPoint: (index: number) => void;
  initialChapterPageIndex: number;
  isFinishedInitialScrollOffset: boolean;
}

export interface PageSliderNavigatorMethods {
  snapPointTo(index: number): void;
}
