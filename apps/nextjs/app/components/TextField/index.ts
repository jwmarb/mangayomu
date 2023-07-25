import TextField from './TextField';
export default TextField;
import { OverrideClassName } from '@app/hooks/useClassName';
import { HTMLProps } from 'react';
import { AriaTextFieldProps } from 'react-aria';

export interface TextFieldProps
  extends Omit<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >,
      'onChange'
    >,
    OverrideClassName {
  error?: boolean;
  onChange: (e: string) => void;
  adornment?: React.ReactElement;
}
