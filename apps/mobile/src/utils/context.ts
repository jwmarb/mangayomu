import { InvalidUseContextException } from '@/exceptions/InvalidUseContextException';
import React from 'react';

/**
 * A wrapper for a better type-safety `createContext` from React.
 *
 * @param throwOnNull Whether or not to throw on a null value when invoking `useContext`
 * @param defaultValue A default value for the context.
 * @returns An object containing `Provider` and `useContext`
 * @throws {InvalidUseContextException} If throwOnNull == true && value == null
 */
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
