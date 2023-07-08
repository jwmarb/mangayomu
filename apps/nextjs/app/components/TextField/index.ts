import TextField from './TextField';
export default TextField;
import { OverrideClassName } from '@app/hooks/useClassName';
import { AriaTextFieldProps } from 'react-aria';

export interface TextFieldProps
  extends AriaProps<HTMLInputElement, AriaTextFieldProps>,
    OverrideClassName {
  error?: boolean;
  adornment?: React.ReactElement;
}
