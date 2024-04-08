import React from 'react';

/**
 * A hook to use a boolean with a toggle function
 * @param initial The initial state of the boolean
 * @returns Returns boolean version of React.useState
 */
export default function useBoolean(initial = false) {
  const [bool, setBool] = React.useState<boolean>(initial);

  const toggle = React.useCallback(
    (value?: boolean | ((prev: boolean) => boolean)) => {
      if (value != null) setBool(value);
      else {
        setBool((prev) => !prev);
      }
    },
    [setBool],
  );

  return [bool, toggle] as const;
}
