import { InvalidUseContextException } from '@/exceptions/InvalidUseContextException';
import React from 'react';

export function createContext<T>(throwOnNull = true) {
  const context = React.createContext<T | null>(null);
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
