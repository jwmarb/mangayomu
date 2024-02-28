import useReaderProps from '@screens/Reader/hooks/useReaderProps';
import React from 'react';

export const ParsedUserReaderSettingsContext = React.createContext<ReturnType<
  typeof useReaderProps
> | null>(null);

export function useParsedUserReaderSettings() {
  const ctx = React.useContext(ParsedUserReaderSettingsContext);
  if (ctx == null)
    throw Error(
      'Tried to consume ParsedUserReaderSettingsContext, but the component is not a child of it',
    );
  return ctx;
}
