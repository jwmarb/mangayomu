import { OverrideClassName } from '@app/hooks/useClassName';
import Modal from './modal';
export default Modal;
export interface ModalProps extends React.PropsWithChildren, OverrideClassName {
  title?: string;
}

export interface ModalMethods {
  open: () => void;
  close: () => void;
}
