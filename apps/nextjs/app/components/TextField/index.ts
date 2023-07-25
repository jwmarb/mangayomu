import TextField from './TextField';
export default TextField;
import { OverrideClassName } from '@app/hooks/useClassName';

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
