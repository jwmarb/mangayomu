import { WindowCorrection } from 'recyclerlistview/dist/reactnative/core/ViewabilityTracker';

export type ApplyWindowCorrectionEventHandler = (
  offsetX: number,
  offsetY: number,
  windowCorrection: WindowCorrection
) => void;

export type RowRenderer = (
  type: string | number,
  data: any,
  index: number,
  extendedState?: object | undefined
) => JSX.Element | JSX.Element[] | null;
