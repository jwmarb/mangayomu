import React from 'react';
/**
 * Drop-in replacement for boolean values for React.useState. If the setter function is not given a value, it will toggle the boolean instead.
 * @returns Returns a useState value along with a toggle function to toggle the value.
 */
export default function useBoolean(
  initialState = false,
): [boolean, (value?: React.SetStateAction<boolean>) => void] {
  const [boolean, setBoolean] = React.useState<boolean>(initialState);
  const toggle = React.useCallback(
    (value?: React.SetStateAction<boolean>) => {
      if (value == null) setBoolean((prev) => !prev);
      else setBoolean(value);
    },
    [setBoolean],
  );
  return [boolean, toggle];
}
