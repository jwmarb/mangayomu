import CancelablePromise from '@utils/CancelablePromise';
import React, { DependencyList } from 'react';

/**
 * A generated layout for calling APIs. No need to create your own useState variables since everything is done for you.
 * @param apiCall The API call is a function that returns a promise. This function is invoked upon the component mounting
 * @returns Returns the necessary variables needed for a component that uses an API call
 */
export default function useAPICall<T>(
  apiCall: () => Promise<T>,
  deps: DependencyList = [],
  fetchCondition: boolean = true
) {
  const cancelable = React.useRef(new CancelablePromise<T>(apiCall));
  const [items, setItems] = React.useState<T>();
  const [error, setError] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(fetchCondition);
  React.useEffect(() => {
    if (fetchCondition) {
      refresh();
      return () => {
        cancelable.current.cancel();
      };
    }
  }, deps);
  const refresh = React.useCallback(async () => {
    cancelable.current = new CancelablePromise(apiCall);
    setLoading(true);
    const response = await cancelable.current.start();
    try {
      if (!cancelable.current.isCanceled()) setItems(response);
    } catch (e) {
      if (!cancelable.current.isCanceled()) setError(e as any);
    } finally {
      if (!cancelable.current.isCanceled()) setLoading(false);
    }
  }, [setLoading, cancelable, setItems, setError, ...deps]);

  return {
    state: [items, setItems] as [T | undefined, React.Dispatch<React.SetStateAction<T>>],
    error,
    loading,
    refresh,
  };
}
