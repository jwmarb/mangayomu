import React from 'react';

export default function usePaperBackground() {
  React.useLayoutEffect(() => {
    document.body.classList.replace('bg-default', 'bg-paper');
    return () => {
      document.body.classList.replace('bg-paper', 'bg-default');
    };
  }, []);
}
