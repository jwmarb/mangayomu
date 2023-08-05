import { register } from 'react-native-bundle-splitter';
export default register<ModalInputProps>({
  loader: () => import('./ModalInput'),
});
import { ModalBuilderProps } from '@components/ModalBuilder';
import { TextInputProps } from 'react-native';

export interface ModalInputProps extends ModalBuilderProps, TextInputProps {}
