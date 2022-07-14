export interface ReaderProfile {}

export type ReaderReducerState = {
  scrollPosition: number;
  showOverlay: boolean;
};

export type ReaderReducerAction = {
  type: 'SCROLL_POSITION';
  scrollPosition: number;
};
