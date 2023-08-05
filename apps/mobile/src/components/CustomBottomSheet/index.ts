// export { default as CustomBottomSheet } from './CustomBottomSheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React from 'react';
import { register } from 'react-native-bundle-splitter';
export const CustomBottomSheet = register<CustomBottomSheetProps>({
  loader: () => import('./CustomBottomSheet'),
}) as unknown as React.ForwardRefExoticComponent<
  CustomBottomSheetProps & React.RefAttributes<BottomSheetMethods>
>;
import { BottomSheetProps } from '@gorhom/bottom-sheet';

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
