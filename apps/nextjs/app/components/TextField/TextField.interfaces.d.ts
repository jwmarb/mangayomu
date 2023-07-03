import { OverrideClassName } from '@app/hooks/useClassName';
import { AriaTextFieldProps } from 'react-aria';

export interface TextFieldProps
  extends React.HTMLProps<HTMLInputElement>,
    AriaTextFieldProps,
    OverrideClassName {
  error?: boolean;
}
