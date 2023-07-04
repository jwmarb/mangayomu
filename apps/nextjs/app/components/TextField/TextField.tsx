'use client';
import React from 'react';
import type { TextFieldProps } from './TextField.interfaces';
import useClassName from '@app/hooks/useClassName';
import { AriaTextFieldProps, useTextField } from 'react-aria';
import useBoolean from '@app/hooks/useBoolean';
import { MdClose } from 'react-icons/md';
import IconButton from '@app/components/IconButton';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TextField(props: TextFieldProps, ref: any) {
  const { error = false, adornment, onChange } = props;
  const [show, toggle] = useBoolean();
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const className = useClassName(
    `bg-disabled/[0.5] py-2  ${
      error
        ? 'outline outline-error focus:ring-2 focus:ring-offset-2 focus:ring-error/[0.5]'
        : 'focus:outline-primary focus:outline'
    } ${
      adornment
        ? `pl-10 ${show ? 'pr-10' : 'pr-3'}`
        : show
        ? 'pr-10 pl-3'
        : 'px-3'
    } text-text-primary rounded-xl outline-2`,
    props,
  );

  function handleOnChange(e: string) {
    if (onChange != null) onChange(e);
    toggle(e.length > 0);
  }

  const { inputProps } = useTextField(
    {
      ...(props as AriaTextFieldProps),
      inputElementType: 'input',
      onChange: handleOnChange,
    },
    inputRef,
  );
  return (
    <div className="relative">
      {adornment && (
        <div className="absolute left-0 top-0 bottom-0 text-text-secondary items-center justify-center flex ml-3">
          {React.cloneElement(adornment, {
            className: 'w-5 h-5',
          })}
        </div>
      )}
      <input
        {...(inputProps as React.HTMLProps<HTMLInputElement>)}
        ref={(r) => {
          if (ref) ref.current = r;
          inputRef.current = r;
        }}
        aria-invalid={error}
        className={className}
      />
      {show && (
        <div className="absolute right-0 top-0 bottom-0 text-text-secondary items-center justify-center flex">
          <IconButton
            icon={<MdClose />}
            onPress={() => {
              if (inputRef.current) {
                inputRef.current.value = '';
                handleOnChange('');
              }
            }}
          />
        </div>
      )}
    </div>
  );
}

export default React.forwardRef(TextField);
