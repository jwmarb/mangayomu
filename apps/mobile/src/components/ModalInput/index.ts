import ModalInput from './ModalInput';
export default ModalInput;
import { ModalBuilderProps } from '@components/ModalBuilder';
import { TextInputProps } from 'react-native';

export interface ModalInputProps extends ModalBuilderProps, TextInputProps {}
