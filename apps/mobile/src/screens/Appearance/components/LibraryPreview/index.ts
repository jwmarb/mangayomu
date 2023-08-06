import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { StyleProp, ViewStyle } from 'react-native';
import { register } from 'react-native-bundle-splitter';
import { SharedValue } from 'react-native-reanimated';
export default register<LibraryPreviewProps>({
  loader: () => import('./LibraryPreview'),
}) as unknown as React.ForwardRefExoticComponent<
  LibraryPreviewProps & React.RefAttributes<BottomSheetMethods>
>;

export interface LibraryPreviewProps {
  onClose: () => void;
  enableLibraryPreview: boolean;
  letterSpacing: SharedValue<number>;
  fontSize: SharedValue<number>;
  width: SharedValue<number>;
  height: SharedValue<number>;
  cellComponentStyle: StyleProp<ViewStyle>;
}
