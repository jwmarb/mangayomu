import React from 'react';
import useBoolean from '@/hooks/useBoolean';

/**
 * A hook to use user input
 * @param initial The initial user input (this does not count as dirty)
 * @param mutater A callback that modifies the string on input
 * @returns Returns an object with properties for handling user input components
 */
export default function useUserInput(
  initial = '',
  mutater: (sanitized?: string) => string | undefined = (sanitized) =>
    sanitized,
) {
  const [input, setInput] = React.useState<string>(initial);
  const [isDirty, toggleDirty] = useBoolean();

  const setter = React.useCallback((text?: string) => {
    const sanitized = mutater(text?.trim().toLowerCase());
    if (sanitized != null) {
      toggleDirty(true);
      setInput(sanitized);
    }
  }, []);
  return { input, setInput: setter, isDirty };
}
