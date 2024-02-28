import React from 'react';

/**
 * Create a ref copy of a state to be consumed in a function that does not update to state changes of a component
 * @param initialState The state to track changes
 * @returns Returns the state which can be consumed in any function that does not update
 */
export default function useMutableObject<T>(initialState: T) {
  const ref = React.useRef<T>(initialState);
  ref.current = initialState;
  return ref;
}
