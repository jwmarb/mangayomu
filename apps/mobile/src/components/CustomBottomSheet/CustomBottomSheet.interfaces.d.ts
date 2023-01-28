import { BottomSheetProps } from '@gorhom/bottom-sheet';

type SelectivePartial<T, K extends keyof T, U = Pick<T, K>> = Omit<T, K> & {
  [L in keyof U]?: U[L];
};

export interface CustomBottomSheetProps
  extends Omit<SelectivePartial<BottomSheetProps, 'snapPoints'>, 'children'> {
  children: React.ReactNode | React.ReactNode[];
  header?: React.ReactNode;
}
