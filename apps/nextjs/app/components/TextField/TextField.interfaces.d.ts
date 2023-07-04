import { OverrideClassName } from '@app/hooks/useClassName';
import { AriaTextFieldProps } from 'react-aria';

export interface TextFieldProps extends AriaTextFieldProps, OverrideClassName {
  error?: boolean;
  adornment?: React.ReactElement;
}
