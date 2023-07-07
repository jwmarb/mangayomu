import ModalMenu from './ModalMenu';
export default ModalMenu;
import { ModalBuilderProps } from '@components/ModalBuilder';

export interface ModalMenuProps<T> extends ModalBuilderProps {
  value: T;
  onChange: (newValue: T) => void;
  enum: Record<string | number, T>;
}
