import { WindowCorrection } from 'recyclerlistview/dist/reactnative/core/ViewabilityTracker';

export type ApplyWindowCorrectionEventHandler = (
  offsetX: number,
  offsetY: number,
  windowCorrection: WindowCorrection
) => void;
