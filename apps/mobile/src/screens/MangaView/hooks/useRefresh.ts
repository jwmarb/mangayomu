import useBoolean from '@hooks/useBoolean';
import React from 'react';

export default function useRefresh(refreshFnToExecute: () => void) {
  const [refreshing, setRefreshing] = useBoolean();
  function handleOnRefresh() {
    setRefreshing(true);
  }

  React.useEffect(() => {
    if (refreshing) {
      try {
        refreshFnToExecute();
      } finally {
        setRefreshing(false);
      }
    }
  }, [refreshing]);

  return [refreshing, handleOnRefresh] as const;
}
