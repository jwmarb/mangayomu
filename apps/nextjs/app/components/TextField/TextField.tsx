'use client';
import React from 'react';
import type { TextFieldProps } from './';
import useClassName from '@app/hooks/useClassName';
import useBoolean from '@app/hooks/useBoolean';
import { MdClose } from 'react-icons/md';
import IconButton from '@app/components/IconButton';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TextField(props: TextFieldProps, ref: any) {
  const { error = false, adornment, onChange, disabled, ...rest } = props;
  const [show, toggle] = useBoolean();
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  React.useImperativeHandle(ref, () => inputRef.current);
  const className = useClassName(
    `bg-disabled/[0.5] py-2 ${
      error
        ? 'outline outline-error focus:ring-2 focus:ring-offset-2 focus:ring-error/[0.5]'
        : 'focus:outline-primary focus:outline'
    } ${adornment ? `pl-10 ${show ? 'pr-10' : 'pr-3'}` : 'pr-10 pl-3'} ${
      disabled ? 'text-disabled pointer-events-none' : 'text-text-primary'
    } rounded-xl outline-2`,
    props,
  );

  React.useEffect(() => {
    toggle(
      rest.defaultValue != null && rest.defaultValue.toString().length > 0,
    );
  }, [rest.defaultValue, toggle]);

  function handleOnChange(e: string) {
    if (onChange != null) onChange(e);
    toggle(e.length > 0);
  }
  return (
    <div className={`relative ${disabled ? 'cursor-not-allowed' : ''}`}>
      {adornment && (
        <div className="absolute left-0 top-0 bottom-0 text-text-secondary items-center justify-center flex ml-3">
          {React.cloneElement(adornment, {
            className: 'w-5 h-5',
          })}
        </div>
      )}
      <input
        {...(rest as React.HTMLProps<HTMLInputElement>)}
        onChange={(e) => {
          handleOnChange(e.currentTarget.value);
        }}
        ref={inputRef}
        aria-invalid={error}
        className={className}
      />
      <div
        className={
          'absolute right-0 top-0 bottom-0 text-text-secondary items-center justify-center flex' +
          (!show || disabled ? ' opacity-0 pointer-events-none' : '')
        }
      >
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
    </div>
  );
}

export default React.forwardRef(TextField);
