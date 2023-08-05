// export { default as CustomBottomSheet } from './CustomBottomSheet';
import { register } from 'react-native-bundle-splitter';
export const CustomBottomSheet = register<CustomBottomSheetProps>({
  loader: () => import('./CustomBottomSheet'),
});
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
