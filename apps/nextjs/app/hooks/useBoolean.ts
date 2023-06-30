import React from 'react';

/**
 * A hook that provides an efficient way to create `React.useState<boolean>()`
 * @param initializer The initial boolean value. Defaults to `false`
 * @returns Returns a `useState` boolean that functions as a toggler
 */
export default function useBoolean(
  initializer: boolean | (() => boolean) = false,
) {
  const [bool, setBool] = React.useState<boolean>(initializer);
  const toggle = React.useCallback(
    (toggler?: boolean | (() => boolean)) => {
      if (toggler == null) setBool((prev) => !prev);
      else setBool(toggler);
    },
    [setBool],
  );

  return [bool, toggle] as const;
}
