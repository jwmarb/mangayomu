import React from 'react';

export default function createContext<T>() {
  const Context = React.createContext<T | null>(null);
  const useContext = () => {
    const ctx = React.useContext(Context);
    if (ctx == null) throw new Error('Component is not a child of Context');
    return ctx;
  };

  return [Context, useContext] as const;
}
