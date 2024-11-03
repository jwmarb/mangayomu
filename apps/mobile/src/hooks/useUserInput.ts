import React from 'react';
import useBoolean from '@/hooks/useBoolean';

/**
 * A hook to manage user input with optional mutation and dirty state tracking.
 *
 * @param {string} [initial=''] - The initial value of the input. This value is not considered as dirty.
 * @param {(sanitized?: string) => string | undefined} [mutater=(sanitized) => sanitized] - A function that modifies the input text before setting it. It receives the sanitized input and should return the modified input or `undefined` to prevent setting the input.
 * @returns {{
 *   input: string;
 *   setInput: (text?: string) => void;
 *   isDirty: boolean;
 * }} An object containing the current input value, a hook to set the input value, and a boolean indicating whether the input has been modified from its initial state.
 *
 */
export default function useUserInput(
  initial = '',
  mutater: (sanitized?: string) => string | undefined = (sanitized) =>
    sanitized,
) {
  // Initialize the state to hold the current input value and whether it is dirty
  const [input, setInput] = React.useState<string>(initial);
  const [isDirty, toggleDirty] = useBoolean();

  // Create a setter function that sanitizes and sets the input value
  const setter = React.useCallback(
    (text?: string) => {
      // Sanitize the input text by trimming and converting to lowercase
      const sanitized = mutater(text?.trim().toLowerCase());

      // If the sanitized value is not null, mark the input as dirty and set the new input value
      if (sanitized != null) {
        toggleDirty(true);
        setInput(sanitized);
      }
    },
    [mutater],
  ); // Ensure that the setter function is recreated if the mutater changes

  // Return an object with the current input value, the setter function, and the dirty state
  return { input, setInput: setter, isDirty };
}
