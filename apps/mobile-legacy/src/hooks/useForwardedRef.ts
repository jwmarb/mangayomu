import React from 'react';

/**
 * Allows an internal ref of a component to share functionality with a forwarded ref
 * @param forwardedRef The forwarded ref passed into the component from `React.forwardRef`
 * @returns Returns a ref which can be used by both the outside component and internal component
 */
export default function useForwardedRef<T>(
  forwardedRef: React.ForwardedRef<T>,
): React.MutableRefObject<T | null> {
  const ref = React.useRef<T | null>(
    forwardedRef && (forwardedRef as React.MutableRefObject<T | null>).current,
  );
  /**
   * This will also act as a function for initialization and a ref object at the same time
   */
  const fn = React.useRef((refProp: T | null) => {
    ref.current = refProp;
    (forwardedRef as React.MutableRefObject<T | null>).current = refProp;
  }).current;
  (fn as unknown as { current: React.MutableRefObject<T | null> }).current =
    ref;

  return fn as unknown as React.MutableRefObject<T | null>;
}
