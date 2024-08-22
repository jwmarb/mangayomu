import { InvalidUseContextException } from '@/exceptions/InvalidUseContextException';
import React from 'react';

export function createContext<T, TDefault = null>(
  throwOnNull = true,
  defaultValue: TDefault = null as TDefault,
) {
  const context = React.createContext<T | TDefault>(defaultValue);
  return {
    Provider: context.Provider,
    useContext: () => {
      const ctx = React.useContext(context);
      if (ctx == null && throwOnNull) {
        throw new InvalidUseContextException(context);
      }
      return ctx as T;
    },
  };
}
