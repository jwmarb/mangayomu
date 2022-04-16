import React from 'react';

export default function useAPICall<T>(apiCall: () => Promise<T[]>, limitArr?: number) {
  const [items, setItems] = React.useState<T[]>([]);
  const [error, setError] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(true);
  React.useEffect(() => {
    refresh();
  }, []);
  async function refresh() {
    setLoading(true);
    try {
      const response = await apiCall();
      if (limitArr) {
        setItems(response.slice(0, limitArr));
      } else setItems(response);
    } catch (e) {
      setError(e as any);
    } finally {
      setLoading(false);
    }
  }

  return {
    state: [items, setItems] as [T[], React.Dispatch<React.SetStateAction<T[]>>],
    error,
    loading,
    refresh,
  };
}
