import { StyleProp, ViewStyle } from 'react-native';
import { register } from 'react-native-bundle-splitter';
export default register<ScrollToTopProps>({
  loader: () => import('./ScrollToTop'),
});

export interface ScrollToTopProps {
  onPress: () => void;
  onLongPress: () => void;
  style: StyleProp<ViewStyle>;
}
