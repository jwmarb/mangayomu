'use client';
import Text from '@app/components/Text';
import TextField from '@app/components/TextField';
import React from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface FieldProps extends React.HTMLProps<HTMLInputElement> {
  error?: FieldError;
  register: UseFormRegisterReturn;
  name: string;
  hint?: string;
}

export default function Field(props: FieldProps) {
  const { error, name, register, hint } = props;
  const id = name.toLowerCase().replace(/\s/g, '_');
  return (
    <div className="flex flex-col gap-1" aria-label="checkbox">
      <Text
        aria-label="label"
        component="label"
        htmlFor={id}
        className="select-none"
      >
        {name}
      </Text>
      <TextField
        {...props}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(register as any)}
        onChange={(event) => register.onChange({ target: { event } })}
        id={id}
        placeholder={name}
        error={!!error}
      />
      {error && (
        <Text variant="sm-label" color="error">
          {error.message}
        </Text>
      )}
      {hint && (
        <Text variant="sm-label" color="hint">
          * {hint}
        </Text>
      )}
    </div>
  );
}
