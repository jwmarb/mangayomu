import React from 'react';
import useBoolean from '@/hooks/useBoolean';

/**
 * A hook to use user input
 * @param initial The initial user input (this does not count as dirty)
 * @returns Returns an object with properties for handling user input components
 */
export default function useUserInput(initial = '') {
  const [input, setInput] = React.useState<string>(initial);
  const [isDirty, toggleDirty] = useBoolean();

  const setter = React.useCallback((text?: string) => {
    const sanitized = text?.trim().toLowerCase();
    if (sanitized != null) {
      toggleDirty(true);
      setInput(sanitized);
    }
  }, []);
  return { input, setInput: setter, isDirty };
}
