export type ReaderDirection = 'Left to right' | 'Right to left' | 'Webtoon' | 'Vertical';

export interface ReaderProfile {
  preferredReadingDirection: ReaderDirection;
  keepDeviceAwake: boolean;
  showPageNumber: boolean;
  skipChaptersMarkedRead: boolean;
}

export type ReaderReducerState = {
  scrollPosition: number;
  showOverlay: boolean;
};

export type ReaderReducerAction = {
  type: 'SCROLL_POSITION';
  scrollPosition: number;
};
