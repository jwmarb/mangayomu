import { register } from 'react-native-bundle-splitter';
export default register({
  loader: () => import('./ModalMenu'),
}) as unknown as <T>(props: ModalMenuProps<T>) => React.JSX.Element;
import { ModalBuilderProps } from '@components/ModalBuilder';

export interface ModalMenuProps<T> extends ModalBuilderProps {
  value: T;
  onChange: (newValue: T) => void;
  enum: Record<string | number, T>;
}
