import React from 'react';

/**
 * Allows an internal ref of a component to share functionality with a forwarded ref
 * @param forwardedRef The forwarded ref passed into the component from `React.forwardRef`
 * @returns Returns a ref which can be used by both the outside component and internal component
 */
export default function useForwardedRef<T>(
  forwardedRef: React.ForwardedRef<T>,
): React.MutableRefObject<T | null> {
  const ref = React.useRef<T | null>(null);
  React.useImperativeHandle(forwardedRef, () => ref.current as T);
  return ref;
}
