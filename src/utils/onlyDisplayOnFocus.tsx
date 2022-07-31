import { Fallback } from '@hooks/useLazyLoading';
import { useIsFocused } from '@react-navigation/native';
import React from 'react';

/**
 * Make a connvert only display on focus
 * @param Component The component to only render on focus
 * @returns Returns the component that conditionally renders based on focus
 */
export default function onlyDisplayOnFocus<T>(Component: React.FC<T>): React.FC<T> {
  return (props: React.PropsWithChildren<T>) => {
    const isFocused = useIsFocused();
    if (isFocused) return <Component {...props} />;
    return Fallback;
  };
}
