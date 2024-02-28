import LazyFallbackBaseComponent from '@components/LazyFallback/LazyFallback';
import { register } from 'react-native-bundle-splitter';
export default register({
  loader: () => import('./Reader'),
  placeholder: LazyFallbackBaseComponent,
});
