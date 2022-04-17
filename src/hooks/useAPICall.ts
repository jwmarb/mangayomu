import React from 'react';

/**
 * A generated layout for calling APIs. No need to create your own useState variables since everything is done for you.
 * @param apiCall The API call is a function that returns a promise. This function is invoked upon the component mounting
 * @returns Returns the necessary variables needed for a component that uses an API call
 */
export default function useAPICall<T>(apiCall: () => Promise<T>) {
  const [items, setItems] = React.useState<T>();
  const [error, setError] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(true);
  React.useEffect(() => {
    refresh();
  }, []);
  async function refresh() {
    setLoading(true);
    try {
      const response = await apiCall();
      setItems(response);
    } catch (e) {
      setError(e as any);
    } finally {
      setLoading(false);
    }
  }

  return {
    state: [items!, setItems] as [T, React.Dispatch<React.SetStateAction<T>>],
    error,
    loading,
    refresh,
  };
}
