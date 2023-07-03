import React from 'react';
import type { TextFieldProps } from './TextField.interfaces';
import useClassName from '@app/hooks/useClassName';
import { AriaTextFieldProps, useTextField } from 'react-aria';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TextField(props: TextFieldProps, ref: any) {
  const { error = false } = props;
  const className = useClassName(
    `bg-disabled/[0.5] py-2  ${
      error
        ? 'outline outline-error focus:ring-2 focus:ring-offset-2 focus:ring-error/[0.5]'
        : 'focus:outline-primary focus:outline'
    } px-3 text-text-primary rounded-xl outline-2`,
    props,
  );
  const { inputProps } = useTextField(props as AriaTextFieldProps, ref);
  return (
    <input
      {...(inputProps as React.HTMLProps<HTMLInputElement>)}
      ref={ref}
      aria-invalid={error}
      className={className}
    />
  );
}

export default React.forwardRef(TextField);
