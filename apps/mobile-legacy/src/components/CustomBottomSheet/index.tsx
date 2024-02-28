// export { default as CustomBottomSheet } from './CustomBottomSheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React from 'react';
const LazyCustomBottomSheet = React.lazy(() => import('./CustomBottomSheet'));

function CustomBottomSheetWrapper(
  props: CustomBottomSheetProps,
  ref: React.ForwardedRef<BottomSheetMethods>,
) {
  return (
    <React.Suspense>
      <LazyCustomBottomSheet ref={ref} {...props} />
    </React.Suspense>
  );
}

export const CustomBottomSheet = React.forwardRef(CustomBottomSheetWrapper);
import type { BottomSheetProps } from '@gorhom/bottom-sheet';

type SelectivePartial<T, K extends keyof T, U = Pick<T, K>> = Omit<T, K> & {
  [L in keyof U]?: U[L];
};

export interface CustomBottomSheetProps
  extends Omit<SelectivePartial<BottomSheetProps, 'snapPoints'>, 'children'> {
  children: React.ReactNode | React.ReactNode[];
  header?: React.ReactNode;
  onOpen?: () => void;
  showIndicator?: boolean;
}
