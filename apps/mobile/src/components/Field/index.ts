import { InputProps } from '@components/Input';
import Field from './Field';
export default Field;
export interface FieldProps extends Omit<InputProps, 'error'> {
  label: string;
  error?: string;
}
